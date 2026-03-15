// Shopifyのデザインパーツ（Polaris）を読み込む
import { AppProvider, Layout, Page } from '@shopify/polaris';
// 日本語化するための設定ファイル
import jaTranslations from '@shopify/polaris/locales/ja.json';
// 計算部分
import ProfitCalculator from './components/ProfitCalculator';
// UTMツール
import UtmGenerator from './components/UtmGenerator';

const App = () => {
  return (
    <>
      <AppProvider i18n={jaTranslations}>
        <Page title="Shopifyツール">
          <Layout>
            {/* 利益計算機 */}
            <Layout.Section>
              <ProfitCalculator />
            </Layout.Section>

            {/* UTM生成機 */}
            <Layout.Section>
              <UtmGenerator />
            </Layout.Section>
          </Layout>
        </Page>
      </AppProvider>
    </>
  );
};

export default App;
