// ReactからuseStateとuseCallbackを読み込む
import { useState, useCallback } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { Layout, Tabs, Banner, BlockStack } from '@shopify/polaris';
// 計算部分
import ProfitCalculator from './ProfitCalculator';
// UTMツール
import UtmGenerator from './UtmGenerator';
// 商品リスト
import ProductList from './ProductList';
// 一括割引計算機
import BulkDiscountCalculator from './BulkDiscountCalculator';

const ToolManager = () => {
  // タブの状態を管理するためのstate
  const [selectedTab, setSelectedTab] = useState(0);
  // タブがクリックされたときの処理
  const handleTabChange = useCallback((index: number) => setSelectedTab(index), []);
  // リストから選ばれた商品の「価格」を覚えておくstate
  const [selectedPrice, setSelectedPrice] = useState('');
  // バナー表示のstate
  const [showBanner, setShowBanner] = useState(false);
  // 商品リストから価格が選ばれたときの処理
  const handleProductSelect = useCallback((price: string) => {
    setSelectedPrice(price); // 価格を覚える
    setSelectedTab(0); // 利益計算機のタブに切り替える
    setShowBanner(true); // バナーを表示する

    // 3秒後にバナーを消す
    setTimeout(() => {
      setShowBanner(false);
    }, 3000);
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
    {
      id: 'bulk-discount-calculator',
      content: '一括割引計算ツール',
      panelID: 'bulk-discount-panel',
    },
  ];

  return (
    <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* 商品選択のバナー */}
            {showBanner && (
              <Banner title="商品が選択されました！" tone="success" onDismiss={() => setShowBanner(false)}>
                <p>商品リストから価格をセットしました。</p>
              </Banner>
            )}

            {/* 利益計算機 */}
            {selectedTab === 0 && <ProfitCalculator selectedPrice={selectedPrice} />}
            {/* UTM生成機 */}
            {selectedTab === 1 && <UtmGenerator />}
            {/* 商品リスト */}
            {selectedTab === 2 && <ProductList onSelectProduct={handleProductSelect} />}
            {/* 一括割引計算機 */}
            {selectedTab === 3 && <BulkDiscountCalculator />}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Tabs>
  );
};

export default ToolManager;
