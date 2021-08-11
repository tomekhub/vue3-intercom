import mitt from 'mitt';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $intercom: IntercomPlugin;
    }
}

declare global {
    interface Window {
        Intercom: (...args: any) => void;
        attachEvent: any;
    }
}

class IntercomPlugin {
    constructor(readonly appId: string) {
        if (document.readyState === 'complete') {
            this.loadScript(appId);
        } else if (window.attachEvent) {
            window.attachEvent('onload', () => this.loadScript(appId));
        } else {
            window.addEventListener('load', () => this.loadScript(appId), false);
        }
    }
    private emitter = mitt();
    public isReady = false;
    public isVisible = false;
    public unreadCount = 0;

    public onIsReady = (callback: () => void) => this.emitter.on('ready', callback);

    private loadScript(appId: string) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://widget.intercom.io/widget/${appId}`;
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode?.insertBefore(script, firstScript);
        script.onload = () => {
            this.isReady = true;
            this.emitter.emit('ready');
            window.Intercom('onHide', () => (this.isVisible = false));
            window.Intercom('onShow', () => (this.isVisible = true));
            window.Intercom('onUnreadCountChange', (unreadCount: number) => (this.unreadCount = unreadCount));
        };
    }
    public boot(options: Record<string, any>  = { app_id: this.appId }) {
        window.Intercom('boot', options);
    }
    public shutdown() {
        window.Intercom('shutdown');
    }
    public update(...options: any[]) {
        window.Intercom('update', ...options);
    }
    public show() {
        window.Intercom('show');
    }
    public hide() {
        window.Intercom('hide');
    }
    public showMessages() {
        window.Intercom('showMessages');
    }
    public trackEvent(name: string, ...metadata: any[]) {
        window.Intercom('trackEvent', ...[name, ...metadata]);
    }
    public getVisitorId() {
        window.Intercom('getVisitorId');
    }
}
const intercomKey = Symbol('Intercom injection key');

export { IntercomPlugin, intercomKey };
