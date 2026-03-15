import { useState, useEffect } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { Card, TextField, ButtonGroup, Button, Text, FormLayout } from '@shopify/polaris';

const ProfitCalculator = ({ selectedPrice }: { selectedPrice: string }) => {
  // 状態（state）の準備：入力される数字を覚えておく箱
  const [cost, setCost] = useState('1000'); // 原価（初期値1000円）
  const [margin, setMargin] = useState('30'); // 利益率（初期値30%）
  const [sellingPrice, setSellingPrice] = useState(0); // 計算結果（最初は0）

  useEffect(() => {
    if (selectedPrice) {
      setCost(selectedPrice);
    }
  }, [selectedPrice]);

  // ボタンが押された時の計算処理
  const handleCalculate = () => {
    const costNumber = Number(cost);
    const marginNumber = Number(margin);

    // 販売価格 ＝ 原価 ÷ (1 - 利益率/100)
    const calculatedPrice = costNumber / (1 - marginNumber / 100);

    // リモコンを使って結果を画面に反映！（小数点以下は切り捨て）
    setSellingPrice(Math.floor(calculatedPrice));
  };

  // リセットボタン
  const handleReset = () => {
    setCost('1000');
    setMargin('30');
    setSellingPrice(0);
  };

  // 画面の表示（Polarisのブロックを組み立てる）
  return (
    <Card>
      <FormLayout>
        <Text as="h2" variant="headingMd">
          利益率＆販売価格シミュレーター 💰
        </Text>

        <TextField
          label="仕入れ値（原価）円"
          value={cost}
          onChange={(newValue) => setCost(newValue)}
          autoComplete="off"
          type="number"
        />
        <TextField
          label="欲しい利益率（％）"
          value={margin}
          onChange={(newValue) => setMargin(newValue)}
          autoComplete="off"
          type="number"
        />
        <ButtonGroup>
          <Button variant="primary" onClick={handleCalculate}>
            販売価格を計算する
          </Button>

          <Button variant="primary" tone="critical" onClick={handleReset}>
            販売価格をリセットする
          </Button>
        </ButtonGroup>
        {/* 計算結果が0より大きい時だけ、結果の文字を表示する */}
        {sellingPrice > 0 && (
          <Text as="h2" variant="headingLg" tone="success">
            推奨販売価格: {sellingPrice} 円
          </Text>
        )}
      </FormLayout>
    </Card>
  );
};

export default ProfitCalculator;
