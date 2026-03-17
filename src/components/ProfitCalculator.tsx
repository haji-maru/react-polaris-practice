import { useState, useEffect } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { Card, TextField, ButtonGroup, Button, Text, FormLayout, BlockStack, Select } from '@shopify/polaris';

// 端数処理の選択肢
const ROUNDING_OPTIONS = [
  { label: '切り上げ', value: 'ceil' },
  { label: '切り捨て', value: 'floor' },
  { label: '四捨五入', value: 'round' },
];

const ProfitCalculator = ({ selectedPrice }: { selectedPrice: string }) => {
  // 状態（state）の準備：入力される数字を覚えておく箱
  const [cost, setCost] = useState(() => localStorage.getItem('cost') ?? '1000'); // 原価（初期値1000円）
  const [margin, setMargin] = useState(() => localStorage.getItem('margin') ?? '30'); // 利益率（初期値30%）
  const [feeRate, setFeeRate] = useState(() => localStorage.getItem('feeRate') ?? '3.4'); // Shopifyの標準的な決済手数料（初期値3.4%）
  const [roundingMethod, setRoundingMethod] = useState(() => localStorage.getItem('roundingMethod') ?? 'ceil'); // 端数処理の方法（初期値は切り上げ）
  const [sellingPrice, setSellingPrice] = useState(0); // 計算結果（最初は0）

  useEffect(() => {
    if (selectedPrice) {
      setCost(selectedPrice);
    }
  }, [selectedPrice]);

  useEffect(() => {
    localStorage.setItem('cost', cost);
    localStorage.setItem('margin', margin);
    localStorage.setItem('feeRate', feeRate);
    localStorage.setItem('roundingMethod', roundingMethod);
  }, [cost, margin, feeRate, roundingMethod]);

  // ボタンが押された時の計算処理
  const handleCalculate = () => {
    const costNumber = isNaN(Number(cost)) ? 0 : Number(cost); // 原価を数字に変換（もし数字でなければ0）
    const marginNumber = isNaN(Number(margin)) ? 0 : Number(margin); // 利益率を数字に変換（もし数字でなければ0）
    const feeRateNumber = isNaN(Number(feeRate)) ? 0 : Number(feeRate); // 手数料率を数字に変換（もし数字でなければ0）

    // 端数処理の方法を選ぶためのマップ（切り上げ、切り捨て、四捨五入）
    const roundingMap: { [key: string]: (num: number) => number } = {
      ceil: Math.ceil, // 切り上げ
      floor: Math.floor, // 切り捨て
      round: Math.round, // 四捨五入
    };

    // 販売価格 ＝ 原価 ÷ (1 - 利益率/100)
    const calculatedPrice = costNumber / (1 - (marginNumber + feeRateNumber) / 100);

    // リモコンを使って結果を画面に反映！（小数点以下は切り捨て）
    setSellingPrice(roundingMap[roundingMethod](calculatedPrice));
  };

  // 補足テキスト（切り上げ、切り捨て、四捨五入）
  const roundingText: { [key: string]: string } = {
    ceil: `※端数は切り上げています。実際の利益率は${margin}%以上になります。`,
    floor: `※端数は切り捨てています。実際の利益率は${margin}%未満になります。`,
    round: `※端数は四捨五入しています。実際の利益率は${margin}%付近になります。`,
  };

  // リセットボタン
  const handleReset = () => {
    setCost('1000');
    setMargin('30');
    setFeeRate('3.4');
    setRoundingMethod('ceil');
    setSellingPrice(0);
    localStorage.removeItem('cost');
    localStorage.removeItem('margin');
    localStorage.removeItem('feeRate');
    localStorage.removeItem('roundingMethod');
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
        <Select
          label="端数処理の方法"
          options={ROUNDING_OPTIONS}
          value={roundingMethod}
          onChange={(value) => setRoundingMethod(value)}
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
              {roundingText[roundingMethod]}
            </Text>
          </BlockStack>
        )}
      </FormLayout>
    </Card>
  );
};

export default ProfitCalculator;
