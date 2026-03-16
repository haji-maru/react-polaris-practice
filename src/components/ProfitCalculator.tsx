import { useState, useEffect } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { Card, TextField, ButtonGroup, Button, Text, FormLayout, BlockStack } from '@shopify/polaris';

const ProfitCalculator = ({ selectedPrice }: { selectedPrice: string }) => {
  // 状態（state）の準備：入力される数字を覚えておく箱
  const [cost, setCost] = useState('1000'); // 原価（初期値1000円）
  const [margin, setMargin] = useState('30'); // 利益率（初期値30%）
  const [feeRate, setFeeRate] = useState('3.4'); // Shopifyの標準的な決済手数料（初期値3.4%）
  const [sellingPrice, setSellingPrice] = useState(0); // 計算結果（最初は0）

  useEffect(() => {
    if (selectedPrice) {
      setCost(selectedPrice);
    }
  }, [selectedPrice]);

  // ボタンが押された時の計算処理
  const handleCalculate = () => {
    const costNumber = isNaN(Number(cost)) ? 0 : Number(cost); // 原価を数字に変換（もし数字でなければ0）
    const marginNumber = isNaN(Number(margin)) ? 0 : Number(margin); // 利益率を数字に変換（もし数字でなければ0）
    const feeRateNumber = isNaN(Number(feeRate)) ? 0 : Number(feeRate); // 手数料率を数字に変換（もし数字でなければ0）

    // 販売価格 ＝ 原価 ÷ (1 - 利益率/100)
    const calculatedPrice = costNumber / (1 - (marginNumber + feeRateNumber) / 100);

    // リモコンを使って結果を画面に反映！（小数点以下は切り捨て）
    setSellingPrice(Math.ceil(calculatedPrice));
  };

  // リセットボタン
  const handleReset = () => {
    setCost('1000');
    setMargin('30');
    setFeeRate('3.4');
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
        <TextField
          label="決済手数料率（％）"
          value={feeRate}
          onChange={(newValue) => setFeeRate(newValue)}
          autoComplete="off"
          type="number"
          helpText="Shopifyペイメント標準は3.4%です"
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
          <BlockStack gap="200">
            <Text as="h2" variant="headingLg" tone="success">
              推奨販売価格: {sellingPrice.toLocaleString()} 円
            </Text>
            {/* どんな条件で出た価格かを説明する補足テキスト */}
            <Text as="p" variant="bodySm" tone="subdued">
              ※決済手数料（{feeRate}%）を引いても、{margin}%の利益が残る価格です。
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              ※端数は切り上げています。実際の利益率は{margin}%以上になります。
            </Text>
          </BlockStack>
        )}
      </FormLayout>
    </Card>
  );
};

export default ProfitCalculator;
