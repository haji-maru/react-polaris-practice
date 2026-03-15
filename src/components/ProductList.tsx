// ReactからuseStateとuseCallbackを読み込む
import { useState, useCallback } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { ResourceList, ResourceItem, Text, Thumbnail, Card, TextField, BlockStack } from '@shopify/polaris';
// 商品データのモック（仮のデータ）
import { MockProductsData } from '../mocks/MockProductsData';

// 商品リストコンポーネント：親から`onSelectProduct`関数を受け取る
const ProductList = ({ onSelectProduct }: { onSelectProduct: (price: string) => void }) => {
  // 検索バーの状態を管理するためのstate
  const [searchValue, setSearchValue] = useState('');
  // 検索バーの入力が変わったときの処理
  const handleSearchChange = useCallback((value: string) => setSearchValue(value), []);

  const filteredProducts = MockProductsData.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <Card>
      <BlockStack gap="400">
        <TextField
          label="商品検索"
          value={searchValue}
          onChange={handleSearchChange}
          autoComplete="off"
          placeholder="例：Tシャツ"
          clearButton // 入力内容を一括消去するボタン
          onClearButtonClick={() => setSearchValue('')} // クリアボタンが押されたときの処理
        />

        <Text as="h2" variant="headingMd">
          商品リスト 📦
        </Text>

        <ResourceList
          resourceName={{ singular: '商品', plural: '商品' }} // リストの名前を定義
          items={filteredProducts} // フィルタリングされた商品データを渡す
          renderItem={(item) => {
            // 商品データから必要な情報を取り出す
            const { id, name, price, inventory, media } = item;
            // サムネイル画像を作成（PolarisのThumbnailコンポーネントを使用）
            const mediaElement = <Thumbnail source={media} alt={name} />;

            return (
              <ResourceItem
                id={id}
                media={mediaElement}
                accessibilityLabel={`${name}を選択して利益計算機に価格を反映`} // アクセシビリティのためのラベル
                onClick={() => {
                  onSelectProduct(price); // 商品がクリックされたときに価格を親に伝える
                }}>
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {name}
                </Text>
                <Text variant="bodyMd" as="p">
                  価格: ¥{Number(price).toLocaleString()}
                </Text>
                <Text variant="bodyMd" as="p">
                  在庫: {Number(inventory).toLocaleString()}
                </Text>
              </ResourceItem>
            );
          }}
        />
        {filteredProducts.length === 0 && (
          <Text variant="bodyMd" as="p">
            条件に合う商品が見つかりませんでした。
          </Text>
        )}
      </BlockStack>
    </Card>
  );
};

export default ProductList;
