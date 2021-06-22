import { App, Plugin, MarkdownPostProcessorContext } from 'obsidian';


declare var WaveDrom;

export default class MyPlugin extends Plugin {
	onInit() {

	}


	wavedromProcessor = async (source: string, el: HTMLElement, _: MarkdownPostProcessorContext) => {
		var wavedromDefault = document.createElement('script');
		var wavedromMin = document.createElement('script');
		wavedromMin.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/wavedrom/2.6.8/wavedrom.min.js');
		wavedromDefault.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/wavedrom/2.6.8/skins/default.js');
		wavedromMin.setAttribute('type','text/javascript');
		wavedromDefault.setAttribute('type','text/javascript');

		document.head.appendChild(wavedromDefault);
		document.head.appendChild(wavedromMin);
		
		const dest = document.createElement('script');
		dest.setAttribute('type', 'WaveDrom');

		source = source.replace(/&nbsp;/gi, " ");
		
        dest.setAttribute('src',source);
       
		
        el.appendChild(dest);
		console.log('Processed');
		document.body.onload = WaveDrom.ProcessAll();
    };

    onload(): void {
        console.log('loading plugin wavedrom');
		
		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});


        this.registerMarkdownCodeBlockProcessor("wavedrom", this.wavedromProcessor);

    }


	onunload() {
		console.log('unloading plugin');
	}
}



