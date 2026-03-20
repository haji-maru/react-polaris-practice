// ReactからuseStateとuseCallbackを読み込む
import { useState, useCallback, useEffect } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { ResourceList, ResourceItem, Text, Thumbnail, Card, TextField, BlockStack } from '@shopify/polaris';

// 商品データの型定義
type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
};

// 為替レート（ドルから円への変換に使用）
const USD_TO_JPY = 150; // 1ドル = 150円（固定レート）

// 商品リストコンポーネント：親から`onSelectProduct`関数を受け取る
const ProductList = ({ onSelectProduct }: { onSelectProduct: (price: string) => void }) => {
  // 検索バーの状態を管理するためのstate
  const [searchValue, setSearchValue] = useState('');
  // 検索バーの入力が変わったときの処理
  const handleSearchChange = useCallback((value: string) => setSearchValue(value), []);
  // APIから取得したデータを管理
  const [products, setProducts] = useState<Product[]>([]);
  // データ取得中のLoading状態
  const [isLoading, setIsLoading] = useState(false);
  // エラーが発生した時のメッセージ
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // データ取得開始
      setError(''); // エラーをリセット
      try {
        const response = await fetch('https://dummyjson.com/products?limit=5'); // APIからデータを取得
        const data = await response.json(); // 取得したデータをJSON形式に変換
        setProducts(data.products); // 取得したデータをstateにセット
      } catch (err) {
        console.error(err);
        setError('商品データの取得に失敗しました。'); // エラーメッセージをセット
      } finally {
        setIsLoading(false); // データ取得完了
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // ローディング中とエラー時の表示
  if (isLoading) {
    return (
      <Card>
        <Text as="p" variant="bodyMd">
          読み込み中...
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Text as="p" variant="bodyMd" tone="critical">
          {error}
        </Text>
      </Card>
    );
  }

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
            // APIデータから必要な情報を取り出す
            const { id, title, price, stock, thumbnail } = item;
            // サムネイル画像を作成（PolarisのThumbnailコンポーネントを使用）
            const mediaElement = <Thumbnail source={thumbnail} alt={title} />;

            return (
              <ResourceItem
                id={String(id)}
                media={mediaElement}
                accessibilityLabel={`${title}を選択して利益計算機に価格を反映`} // アクセシビリティのためのラベル
                onClick={() => {
                  onSelectProduct(String(Math.round(price * USD_TO_JPY))); // 商品がクリックされたときに価格を親に伝える
                }}>
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {title}
                </Text>
                <Text variant="bodyMd" as="p">
                  価格: ¥{Math.round(price * USD_TO_JPY).toLocaleString()}円 {/* ドル価格を円に変換して表示 */}
                </Text>
                <Text variant="bodyMd" as="p">
                  在庫: {Number(stock).toLocaleString()}
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
