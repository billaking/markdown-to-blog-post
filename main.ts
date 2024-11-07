import { App as app, Plugin, PluginSettingTab, Setting, TFile, Notice, Modal } from 'obsidian';
import { marked } from 'marked';

interface MarkdownToHtmlPluginSettings {
  imageUrl: string;
  documentUrl: string;
}

const DEFAULT_SETTINGS: MarkdownToHtmlPluginSettings = {
  imageUrl: '/sites/default/files/inline-images/',
  documentUrl: 'https://www.cooljcxii.org/',
};

export default class MarkdownToHtmlPlugin extends Plugin {

  settings: MarkdownToHtmlPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: 'convert-markdown-to-blog-post',
      name: 'Convert Markdown to Blog Post',
      callback: () => this.convertMarkdownToHtml(),
    });
    this.addSettingTab(new MarkdownToHtmlSettingTab(this.app, this));
    this.addRibbonIcon('globe', 'Convert current note to blog post', async () => {
      await this.convertMarkdownToHtml();
    });
  }

  async convertMarkdownToHtml() {
    const { imageUrl, documentUrl } = this.settings;

    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice('No active file found');
      return;
    }

    try {
      let markdownContent = await this.app.vault.read(activeFile);

      // Convert this string '![[image]]' to <img src="image" alt="image">
      markdownContent = markdownContent.replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
        return `<img src="${imageUrl}${p1.replace(/ /g, '-')}" alt="${p1}">`;
      });

      // Convert [[link]] to <a href="link">link</a>
      markdownContent = markdownContent.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
        return `<a href="${documentUrl}${p1.replace(/ /g, '-')}">${p1}</a>`;
      });

      const htmlContent = marked(markdownContent);
      const html = `<div>${htmlContent}</div>`;
      const htmlFileName = activeFile.basename + '.html';

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
    this.settings = DEFAULT_SETTINGS;
  }

  async saveSettings() {
    await this.saveData(this.settings);
    console.log('Saved settings:', this.settings);
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
    let { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Markdown to Blog post settings' });
    containerEl.createEl('p', { text: 'This plugin will convert most markdown tags into a html structure so that you can paste your note content into a Content Management System (CMS) like Drupal or Wordpress; without having to do it manually.' });

    new Setting(containerEl)
      .setName('Web path to your images folder')
      .setDesc('URL to prefix the markdown links to. Example for Drupal: /sites/default/files/inline-images/')
      .addText(text => text
        .setPlaceholder('/sites/default/files/inline-images/')
        .setValue(this.plugin.settings.imageUrl)
        .onChange(async (value) => {
          this.plugin.settings.imageUrl = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Web path to your web documents folder')
      .setDesc('URL to prefix the markdown links to. Example for Drupal: /node/node_id')
      .addText(text => text
        .setPlaceholder('/')
        .setValue(this.plugin.settings.documentUrl)
        .onChange(async (value) => {
          this.plugin.settings.documentUrl = value;
          await this.plugin.saveSettings();
        }));
    containerEl.createEl('p', { text: 'To report bug contact me at GitHub https://github.com/billaking' });
  }
}

class OverwriteModal extends Modal {
  onConfirm: () => void;

  constructor(app: app, onConfirm: () => void) {
    super(app);
    this.onConfirm = onConfirm;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'File already exists' });
    contentEl.createEl('p', { text: 'Do you want to overwrite the existing file?' });

    const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

    const confirmButton = buttonContainer.createEl('button', { text: 'Overwrite' });
    confirmButton.addEventListener('click', () => {
      this.onConfirm();
      this.close();
    });

    const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
    cancelButton.addEventListener('click', () => {
      this.close();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
