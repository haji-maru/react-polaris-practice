import { useEffect, useState } from 'react';
import { Card, TextField, ButtonGroup, Button, Text, FormLayout, BlockStack, InlineStack } from '@shopify/polaris';

const GrossProfitCalculator = () => {
  const [grossSellingPrice, setGrossSellingPrice] = useState(() => localStorage.getItem('grossSellingPrice') ?? '1500'); // 販売価格
  const [grossCost, setGrossCost] = useState(() => localStorage.getItem('grossCost') ?? '1000'); // 原価
  const [grossQuantity, setGrossQuantity] = useState(() => localStorage.getItem('grossQuantity') ?? '3'); // 売上数量
  const [grossProfit, setGrossProfit] = useState(0); // 粗利益
  const [grossProfitMargin, setGrossProfitMargin] = useState(0); // 粗利率
  const [grossProfitPerUnit, setGrossProfitPerUnit] = useState(0); // 粗利（1個あたり）

  useEffect(() => {
    localStorage.setItem('grossSellingPrice', grossSellingPrice);
    localStorage.setItem('grossCost', grossCost);
    localStorage.setItem('grossQuantity', grossQuantity);
  }, [grossSellingPrice, grossCost, grossQuantity]);

  const handleCalculate = () => {
    const sellingPriceNumber = isNaN(Number(grossSellingPrice)) ? 0 : Number(grossSellingPrice);
    const grossCostNumber = isNaN(Number(grossCost)) ? 0 : Number(grossCost);
    const quantityNumber = isNaN(Number(grossQuantity)) ? 0 : Number(grossQuantity);
    // 粗利
    const profit = sellingPriceNumber - grossCostNumber;
    // 粗利益率
    const margin = (profit / sellingPriceNumber) * 100;
    // 粗利益合計
    const totalProfit = profit * quantityNumber;
    setGrossProfit(Math.round(totalProfit)); // 粗利益の合計をセット
    setGrossProfitPerUnit(Math.round(profit)); // 粗利益（1個あたり）をセット
    setGrossProfitMargin(Math.round(margin * 10) / 10); // 粗利率を小数点第1位までセット
  };

  // リセットボタン
  const handleReset = () => {
    setGrossSellingPrice('1500');
    setGrossCost('1000');
    setGrossQuantity('3');
    setGrossProfit(0);
    setGrossProfitPerUnit(0);
    setGrossProfitMargin(0);
    localStorage.removeItem('grossSellingPrice');
    localStorage.removeItem('grossCost');
    localStorage.removeItem('grossQuantity');
  };

  return (
    <Card>
      <FormLayout>
        <Text as="h2" variant="headingMd">
          粗利益計算ツール 💰
        </Text>

        <TextField
          label="販売価格"
          value={grossSellingPrice}
          onChange={setGrossSellingPrice}
          autoComplete="off"
          type="number"
        />
        <TextField label="原価" value={grossCost} onChange={setGrossCost} autoComplete="off" type="number" />
        <TextField
          label="売上数量"
          value={grossQuantity}
          onChange={setGrossQuantity}
          autoComplete="off"
          type="number"
        />
        <ButtonGroup>
          <Button variant="primary" onClick={handleCalculate}>
            粗利益の合計を計算する
          </Button>
          <Button variant="primary" tone="critical" onClick={handleReset}>
            粗利益の合計をリセットする
          </Button>
        </ButtonGroup>
        {grossProfit > 0 && (
          <BlockStack gap="200">
            <Text as="p" variant="headingLg" tone="success">
              粗利合計: {grossProfit.toLocaleString()} 円
            </Text>
            <InlineStack gap="200">
              <Text as="p" variant="bodyMd" tone="subdued">
                粗利（1個あたり）:
              </Text>
              <Text as="p" variant="bodyMd">
                ¥{grossProfitPerUnit.toLocaleString()}
              </Text>
            </InlineStack>
            <InlineStack gap="200">
              <Text as="p" variant="bodyMd" tone="subdued">
                粗利率:
              </Text>
              <Text as="p" variant="bodyMd">
                {grossProfitMargin}%
              </Text>
            </InlineStack>
          </BlockStack>
        )}
      </FormLayout>
    </Card>
  );
};

export default GrossProfitCalculator;
