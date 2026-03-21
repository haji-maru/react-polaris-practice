import { useState, useEffect } from 'react';
// Shopifyのデザインパーツ（Polaris）を読み込む
import { Card, TextField, ButtonGroup, Button, Text, FormLayout, BlockStack, Select } from '@shopify/polaris';

// RailsのAPIのURL
const API_URL = 'http://localhost:3000/api/v1/calculator_settings';

// 端数処理の選択肢
const ROUNDING_OPTIONS = [
  { label: '切り上げ', value: 'ceil' },
  { label: '切り捨て', value: 'floor' },
  { label: '四捨五入', value: 'round' },
];

const ProfitCalculator = ({ selectedPrice }: { selectedPrice: string }) => {
  // 状態（state）の準備：入力される数字を覚えておく箱
  const [cost, setCost] = useState('1000'); // 原価（初期値1000円）
  const [margin, setMargin] = useState('30'); // 利益率（初期値30%）
  const [feeRate, setFeeRate] = useState('3.4'); // Shopifyの標準的な決済手数料（初期値3.4%）
  const [roundingMethod, setRoundingMethod] = useState('ceil'); // 端数処理の方法（初期値は切り上げ）
  const [sellingPrice, setSellingPrice] = useState(0); // 計算結果（最初は0）
  const [settingsId, setSettingsId] = useState<number | null>(null); // APIから取得した設定値のIDを管理

  useEffect(() => {
    if (selectedPrice) {
      setCost(selectedPrice);
    }
  }, [selectedPrice]);

  // アプリ起動時にAPIから設定値を取得
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // データが存在する場合はStateにセット
        if (data.id) {
          setCost(data.cost);
          setMargin(data.margin);
          setFeeRate(data.fee_rate);
          setRoundingMethod(data.rounding_method);
          setSettingsId(data.id); // 設定値のIDを保存
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  // ボタンが押された時の計算処理
  const handleCalculate = async () => {
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

    // APIに設定値を保存する
    const body = JSON.stringify({
      calculator_setting: {
        cost,
        margin,
        fee_rate: feeRate,
        rounding_method: roundingMethod,
      },
    });

    try {
      if (settingsId) {
        // IDがある場合は更新（PATCH）
        await fetch(`${API_URL}/${settingsId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
      } else {
        // IDがない場合は新規作成（POST）
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
        const data = await response.json();
        setSettingsId(data.id); // 新規作成した設定値のIDを保存
      }
    } catch (error) {
      console.error(error);
    }
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
