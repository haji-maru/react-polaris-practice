// Shopifyのデザインパーツ（Polaris）を読み込む
import { ResourceList, ResourceItem, Text, Thumbnail, Card } from '@shopify/polaris';
// 商品データのモック（仮のデータ）
import { MockProductsData } from '../mocks/MockProductsData';

// 商品リストコンポーネント：親から`onSelectProduct`関数を受け取る
const ProductList = ({ onSelectProduct }: { onSelectProduct: (price: string) => void }) => {
  return (
    <Card>
      <Text as="h2" variant="headingMd">
        商品リスト 📦
      </Text>

      <ResourceList
        resourceName={{ singular: '商品', plural: '商品' }} // リストの名前を定義
        items={MockProductsData} // モックデータを渡す
        renderItem={(item) => {
          // 商品データから必要な情報を取り出す
          const { id, name, price, inventory, media } = item;
          // サムネイル画像を作成（PolarisのThumbnailコンポーネントを使用）
          const mediaElement = <Thumbnail source={media} alt={name} />;

          return (
            <ResourceItem
              id={id}
              media={mediaElement}
              accessibilityLabel={`${name}の詳細を表示`}
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
    </Card>
  );
};

export default ProductList;
