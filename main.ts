import { App as app, Plugin, PluginSettingTab, Setting, TFile, Notice } from 'obsidian';
import { marked } from 'marked';



interface MarkdownToHtmlPluginSettings {
  webUrl: string;
}

const DEFAULT_SETTINGS: MarkdownToHtmlPluginSettings = {
  webUrl: '/sites/default/files/inline-images/',
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

    const webUrl = this.settings.webUrl;


    console.log('Web URL:', webUrl);


    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice('No active file found');
      return;
    }

    try {
      let  markdownContent = await this.app.vault.read(activeFile);

      // Convert [[link]] to <a href="link">link</a>
      markdownContent = markdownContent.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
        return `<a href="${webUrl}${p1.replace(' ','-')}">${p1}</a>`;
      });
      
      // Convert ![[image]] to <img src="image" alt="image">
      markdownContent = markdownContent.replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
        return `<img src="${webUrl}${p1.replace(' ','-')}" alt="${p1}">`;
      });

      const htmlContent = marked(markdownContent);
      const html = `<div>${htmlContent}</div>`;
      const htmlFileName = activeFile.basename + '.html';

      await this.app.vault.create(htmlFileName, html);
      new Notice(`Converted to ${htmlFileName}`);
    } catch (error) {
      new Notice('Error converting markdown to Blog post');
      console.error(error);
    }
  }

  async loadSettings() {
    this.settings = DEFAULT_SETTINGS;
    console.log('Loaded settings:', this.settings.webUrl);
  }

  async saveSettings() {
    await this.saveData(this.settings);
    console.log('Saved settings:', this.settings.webUrl);
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
        .setName('Location of images, documents, etc')
        .setDesc('URL to prefix the markdown links to. Example for Drupal: /sites/default/files/inline-images/')
        .addText(text => text
          .setPlaceholder('/sites/default/files/inline-images/')
          .setValue(this.plugin.settings.webUrl)
          .onChange(async (value) => {
            this.plugin.settings.webUrl = value;
            await this.plugin.saveSettings();
          }));
    containerEl.createEl('p', { text: 'To report bug contact me at ' });


          
    }
  }
