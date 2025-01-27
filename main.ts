import {App as app, Plugin, PluginSettingTab, Setting, TFile, Notice, Modal} from 'obsidian';
import {marked, Renderer} from 'marked';

interface MarkdownToHtmlPluginSettings {
    imageUrl: string;
    documentUrl: string;
    useAppUrl: boolean;
    useHtmlExtension: boolean;
    useThisIcon: string;
    savePath: string;
}

const DEFAULT_SETTINGS: MarkdownToHtmlPluginSettings = {
    imageUrl: '/sites/default/files/inline-images/',
    documentUrl: 'https://www.billaking.com/',
    useAppUrl: false,
    useHtmlExtension: false,
    useThisIcon: 'file-code-2',
    savePath: 'HTML',
};

export default class MarkdownToHtmlPlugin extends Plugin {
    settings: MarkdownToHtmlPluginSettings;

    async onload() {
        await this.loadSettings();
        this.addCommand({
            id: 'convert-note-to-html-html-markdown-mix',
            name: 'Converts note to raw html or mix markdown with html',
            callback: () => this.convertMarkdownToHtml(),
        });
        this.addSettingTab(new MarkdownToHtmlSettingTab(this.app, this));
        this.updateRibbonIcon();
    }

    updateRibbonIcon() {
        this.addRibbonIcon(this.settings.useThisIcon, 'Converts note...', async () => {
            await this.convertMarkdownToHtml();
        });
    }

    async convertMarkdownToHtml() {
        const { imageUrl, documentUrl, useAppUrl, useHtmlExtension, savePath} = this.settings;
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            new Notice('No active file found');
            return;
        }

        try {
            let markdownContent = await this.app.vault.read(activeFile);
            markdownContent = markdownContent.replace(/^---[\s\S]*?---\n/, '');
            markdownContent = markdownContent.replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
                return `<img src="${imageUrl}${p1.replace(/ /g, '-')}" alt="${p1}">`;
            });
            markdownContent = markdownContent.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
                return useAppUrl ? `[${p1}](${p1.replace(/ /g, '-')})` : `<a href="${documentUrl}${p1.replace(/ /g, '-')}">${p1}</a>`;
            });

            const renderer = new Renderer();
            renderer.link = ({href, title, text}) => {
                href = href.replace(/ /g, '%20');
                return `[${text}](${href})`;
            };

            marked.use({renderer});
            const htmlContent = marked(markdownContent);
            const html = `<div>${htmlContent}</div>`;
            const htmlFileName = `${savePath}/${activeFile.basename}${useHtmlExtension ? '.html' : '.html.md'}`;

            const folderExists = this.app.vault.getAbstractFileByPath(savePath);
            if (!folderExists) {
                await this.app.vault.createFolder(savePath);
            }

            const existingFile = this.app.vault.getAbstractFileByPath(htmlFileName);
            if (existingFile) {
                new OverwriteModal(this.app, async () => {
                    await this.app.vault.modify(existingFile as TFile, html);
                    new Notice(`Overwritten ${htmlFileName}`);
                }).open();
            } else {
                await this.app.vault.create(htmlFileName, html);
                new Notice(`Converted to ${htmlFileName}`);
            }
        } catch (error) {
            new Notice('Error converting markdown to Blog post');
            console.error(error);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        if (!this.settings.useThisIcon) {
            this.settings.useThisIcon = 'file-code-2';
        }
        await this.saveData(this.settings);
        this.updateRibbonIcon();
    }

    onunload() {
        console.log('Unloading Markdown to Blog post plugin');
    }
}

class MarkdownToHtmlSettingTab extends PluginSettingTab {
    plugin: MarkdownToHtmlPlugin;

    constructor(app: app, plugin: MarkdownToHtmlPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let {containerEl} = this;
        containerEl.empty();

        containerEl.createEl('h2', {text: 'Markdown to Blog post settings'});
        containerEl.createEl('p', {text: 'This plugin will convert most markdown tags into a html structure so that you can paste your note content into a Content Management System (CMS) like Drupal or Wordpress; without having to do it manually.'});

        new Setting(containerEl)
            .setName('Display links as markdown')
            .setDesc('When toggled, links are formatted as [link title](note link). Default are <a href></a> html tags')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useAppUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.useAppUrl = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Image folder location')
            .setDesc('Files are stored on the web server. Example for Drupal: /sites/default/files/inline-images/. Disabled if <em>Display links as markdown</em> is enabled')
            .addText(text => text
                .setPlaceholder('/sites/default/files/inline-images/')
                .setValue(this.plugin.settings.imageUrl)
                .onChange(async (value) => {
                    this.plugin.settings.imageUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Documents folder location')
            .setDesc('Documents are stored on the web server. Example for Drupal the path is /node/node_id or /node/alias. Disabled if <em>Display links as markdown</em> is enabled')
            .addText(text => text
                .setPlaceholder('/')
                .setValue(this.plugin.settings.documentUrl)
                .onChange(async (value) => {
                    this.plugin.settings.documentUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Export file as html')
            .setDesc('When toggled, files are saved in the html format.')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useHtmlExtension)
                    .onChange(async (value) => {
                        this.plugin.settings.useHtmlExtension = value;
                        await this.plugin.saveSettings();
                    })
            );


        new Setting(containerEl)
            .setName('Menu icon')
            .setDesc('Default is file-code-2. See https://lucide.dev/icons/?search=html for more icons')
            .addText(text => text
                .setPlaceholder('file-code-2')
                .setValue(this.plugin.settings.useThisIcon)
                .onChange(async (value) => {
                    this.plugin.settings.useThisIcon = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Save path')
            .setDesc('Default is HTML. The folder where the files are saved')
            .addText(text => text
                .setPlaceholder('HTML')
                .setValue(this.plugin.settings.savePath)
                .onChange(async (value) => {
                    this.plugin.settings.savePath = value;
                    await this.plugin.saveSettings();
                })
            );


        containerEl.createEl('p', {text: 'To report bug contact me at GitHub https://github.com/billaking'});
    }
}

class OverwriteModal extends Modal {
    onConfirm: () => void;

    constructor(app: app, onConfirm: () => void) {
        super(app);
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.createEl('h2', {text: 'File already exists'});
        contentEl.createEl('p', {text: 'Do you want to overwrite the existing file?'});

        const buttonContainer = contentEl.createDiv({cls: 'modal-button-container'});

        const confirmButton = buttonContainer.createEl('button', {text: 'Overwrite'});
        confirmButton.addEventListener('click', () => {
            this.onConfirm();
            this.close();
        });

        const cancelButton = buttonContainer.createEl('button', {text: 'Cancel'});
        cancelButton.addEventListener('click', () => {
            this.close();
        });
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}