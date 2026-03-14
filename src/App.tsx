// Shopifyのデザインパーツ（Polaris）を読み込む
import { AppProvider, Page } from '@shopify/polaris';
// 日本語化するための設定ファイル
import jaTranslations from '@shopify/polaris/locales/ja.json';
// 計算部分
import ProfitCalculator from './components/ProfitCalculator';

const App = () => {
  return (
    <>
      <AppProvider i18n={jaTranslations}>
        <Page title="利益率＆販売価格シミュレーター 💰">
          <ProfitCalculator />
        </Page>
      </AppProvider>
    </>
  );
};

export default App;
