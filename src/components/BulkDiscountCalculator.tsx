import { useState, useEffect } from 'react';
import { Card, TextField, Button, FormLayout, Text, BlockStack, ButtonGroup, InlineStack } from '@shopify/polaris';

const BulkDiscountCalculator = () => {
  const [mainPrice, setMainPrice] = useState(() => localStorage.getItem('mainPrice') ?? '1000'); // 通常価格
  const [discountRate, setDiscountRate] = useState(() => localStorage.getItem('discountRate') ?? '10'); // 割引率
  const [quantity, setQuantity] = useState(() => localStorage.getItem('quantity') ?? '3'); // 購入数量
  const [discountedUnitPrice, setDiscountedUnitPrice] = useState(0); // 割引後の単価
  const [discountAmount, setDiscountAmount] = useState(0); // 割引額
  const [discountTotal, setDiscountTotal] = useState(0); // 割引後の合計金額

  useEffect(() => {
    localStorage.setItem('mainPrice', mainPrice);
    localStorage.setItem('discountRate', discountRate);
    localStorage.setItem('quantity', quantity);
  }, [mainPrice, discountRate, quantity]);

  const handleCalculate = () => {
    // 通常価格を数字に変換（もしなければ0）
    const mainPriceNumber = isNaN(Number(mainPrice)) ? 0 : Number(mainPrice);
    // 割引率を数字に変換（もしなければ0）
    const discountRateNumber = isNaN(Number(discountRate)) ? 0 : Number(discountRate);
    // 購入数量を数字に変換（もしなければ0）
    const quantityNumber = isNaN(Number(quantity)) ? 0 : Number(quantity);

    // 割引後の価格 ＝ 通常価格 × (1 - 割引率/100)
    const discountedPrice = mainPriceNumber * (1 - discountRateNumber / 100);
    // 割引後の合計金額 ＝ 割引後の価格 × 購入数量
    const total = discountedPrice * quantityNumber;
    setDiscountTotal(Math.round(total));

    // 割引額 ＝ 通常価格 × 購入数量 - 割引後の合計金額
    const discountAmount = mainPriceNumber * quantityNumber - total;
    setDiscountedUnitPrice(Math.round(discountedPrice));
    setDiscountAmount(Math.round(discountAmount));
  };

  // リセットボタン
  const handleReset = () => {
    setMainPrice('1000');
    setDiscountRate('10');
    setQuantity('3');
    setDiscountTotal(0);
    setDiscountedUnitPrice(0);
    setDiscountAmount(0);
    localStorage.removeItem('mainPrice');
    localStorage.removeItem('discountRate');
    localStorage.removeItem('quantity');
  };

  return (
    <Card>
      <FormLayout>
        <Text as="h2" variant="headingMd">
          一括割引計算ツール 🏷️
        </Text>

        <TextField
          label="通常価格"
          value={mainPrice}
          onChange={(newValue) => setMainPrice(newValue)}
          autoComplete="off"
          type="number"
        />
        <TextField
          label="割引率(%)"
          value={discountRate}
          onChange={(newValue) => setDiscountRate(newValue)}
          autoComplete="off"
          type="number"
        />
        <TextField
          label="購入数量"
          value={quantity}
          onChange={(newValue) => setQuantity(newValue)}
          autoComplete="off"
          type="number"
        />
        <ButtonGroup>
          <Button variant="primary" onClick={handleCalculate}>
            割引後の合計金額を計算する
          </Button>

          <Button variant="primary" tone="critical" onClick={handleReset}>
            割引後の合計金額をリセットする
          </Button>
        </ButtonGroup>
        {discountTotal > 0 && (
          <BlockStack gap="200">
            <Text as="h2" variant="headingLg" tone="success">
              割引後の合計金額：{discountTotal.toLocaleString()}円
            </Text>
            <InlineStack gap="200">
              <Text as="p" variant="bodyMd">
                割引後の単価:
              </Text>
              <Text as="p" variant="bodyMd">
                ¥{discountedUnitPrice.toLocaleString()}
              </Text>
            </InlineStack>
            <InlineStack gap="200">
              <Text as="p" variant="bodyMd">
                割引額:
              </Text>
              <Text as="p" variant="bodyMd">
                ¥{discountAmount.toLocaleString()}
              </Text>
            </InlineStack>
          </BlockStack>
        )}
      </FormLayout>
    </Card>
  );
};

export default BulkDiscountCalculator;
