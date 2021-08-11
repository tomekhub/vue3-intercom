import { App, Plugin } from 'vue';
import { intercomKey, IntercomPlugin } from '@/intercom';

// install function executed by app.use()
const install: Exclude<Plugin['install'], undefined> = function installVue3Intercom(app: App, { appId }: { appId: string }) {
  const plugin = new IntercomPlugin(appId);
  app.config.globalProperties.$intercom = plugin;
  app.provide(intercomKey, plugin);
};

// Create module definition for app.use()
export default install;
