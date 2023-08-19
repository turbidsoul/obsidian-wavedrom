import {
  App,
  MarkdownPostProcessorContext,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import { wavedromsrc, defaultsrc } from './wrapwave';
declare var WaveDrom;
interface ObsidianWavedrom2Settings {
  mySetting: string;
}
const DEFAULT_SETTINGS: ObsidianWavedrom2Settings = {
  mySetting: "default",
};
export default class ObsidianWavedrom2 extends Plugin {
  settings: ObsidianWavedrom2Settings;
  async onload() {
    console.log("loading wavedrom plugin");
    await this.loadSettings();
    if (!window.hasOwnProperty("WaveDrom")) {
      var wavedromDefault = document.createElement('script');
      var wavedromMin = document.createElement('script');
      wavedromMin.setAttribute('src', wavedromsrc);
      wavedromDefault.setAttribute('src', defaultsrc);
      wavedromMin.setAttribute('type', 'text/javascript');
      wavedromDefault.setAttribute('type', 'text/javascript');

      document.head.appendChild(wavedromDefault);
      document.head.appendChild(wavedromMin);

      document.head.innerHTML += '<style type="text/css">div.wavedromMenu{position:fixed;border:solid 1pt#CCCCCC;background-color:white;box-shadow:0px 10px 20px #808080;cursor:default;margin:0px;padding:0px;}div.wavedromMenu>ul{margin:0px;padding:0px;}div.wavedromMenu>ul>li{padding:2px 10px;list-style:none;}div.wavedromMenu>ul>li:hover{background-color:#b5d5ff;}</style>';
    }
    this.registerMarkdownCodeBlockProcessor('wavedrom', this.wavedromProcessor);
  }
  async wavedromProcessor(source: string, el: HTMLElement, _: MarkdownPostProcessorContext) {
    let r = 0;
    const wrapper = document.createElement('div');
    wrapper.setAttribute('align', 'center');
    wrapper.setAttribute('id', 'WaveDrom_Display_' + r);
    el.appendChild(wrapper);

    // Create script node with wavedrom json contents
    const inputjson = document.createElement('script');
    inputjson.setAttribute('type', 'WaveDrom');
    source = source.replace(/\n/g, " ");
    inputjson.innerText = source;
    inputjson.setAttribute('id', 'InputJSON_' + r);

    // Eval the script node into a form the wavedrom expects
    var obj = WaveDrom.evaObject(inputjson);

    // Render it to the wrapper div!
    WaveDrom.RenderWaveElement(r, obj, wrapper, window.WaveSkin, false);
  }
  onunload() {
    console.log("unloading plugin");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}
class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }
  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Woah!");
  }
  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
class SampleSettingTab extends PluginSettingTab {
  plugin: ObsidianWavedrom2;
  constructor(app: App, plugin: ObsidianWavedrom2) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });
    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async (value) => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
