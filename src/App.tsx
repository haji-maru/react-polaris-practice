// ReactからuseStateとuseCallbackを読み込む
import { useState, useCallback } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { AppProvider, Layout, Page, Tabs } from '@shopify/polaris';
// 日本語化するための設定ファイル
import jaTranslations from '@shopify/polaris/locales/ja.json';
// 計算部分
import ProfitCalculator from './components/ProfitCalculator';
// UTMツール
import UtmGenerator from './components/UtmGenerator';
// 商品リスト
import ProductList from './components/ProductList';

const App = () => {
  // タブの状態を管理するためのstate
  const [selectedTab, setSelectedTab] = useState(0);
  // タブがクリックされたときの処理
  const handleTabChange = useCallback((selectedTab: number) => setSelectedTab(selectedTab), []);
  // リストから選ばれた商品の「価格」を覚えておくstate
  const [selectedPrice, setSelectedPrice] = useState('');
  // 商品リストから価格が選ばれたときの処理
  const handleProductSelect = useCallback((price: string) => {
    setSelectedPrice(price); // 価格を覚える
    setSelectedTab(0); // 利益計算機のタブに切り替える
  }, []);
  // タブの内容を定義
  const tabs = [
    {
      id: 'profit-calculator',
      content: '利益計算機',
      panelID: 'profit-panel',
    },
    {
      id: 'utm-generator',
      content: 'UTMジェネレーター',
      panelID: 'utm-panel',
    },
    {
      id: 'product-list',
      content: '商品リスト',
      panelID: 'product-panel',
    },
  ];
  return (
    <>
      <AppProvider i18n={jaTranslations}>
        <Page title="Shopifyツール">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
            <Layout>
              <Layout.Section>
                {/* 利益計算機 */}
                {selectedTab === 0 && <ProfitCalculator selectedPrice={selectedPrice} />}

                {/* UTM生成機 */}
                {selectedTab === 1 && <UtmGenerator />}

                {/* 商品リスト */}
                {selectedTab === 2 && <ProductList onSelectProduct={handleProductSelect} />}
              </Layout.Section>
            </Layout>
          </Tabs>
        </Page>
      </AppProvider>
    </>
  );
};

export default App;
