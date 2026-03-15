// Shopifyのデザインパーツ（Polaris）を読み込む
import { AppProvider, Page } from '@shopify/polaris';
// 日本語化するための設定ファイル
import jaTranslations from '@shopify/polaris/locales/ja.json';
import ToolManager from './components/ToolManager';

const App = () => {
  return (
    <>
      <AppProvider i18n={jaTranslations}>
        <Page title="Shopifyツール">
          <ToolManager />
        </Page>
      </AppProvider>
    </>
  );
};

export default App;
