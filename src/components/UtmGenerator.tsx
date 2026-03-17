import { useEffect, useState } from 'react';
import { Card, FormLayout, TextField, Select, Text, Button, Box, BlockStack, InlineStack } from '@shopify/polaris';

const SOURCE_OPTIONS = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'X (Twitter)', value: 'twitter' },
  { label: 'LINE配信', value: 'line' },
  { label: 'メルマガ', value: 'newsletter' },
];

const UtmGenerator = () => {
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem('baseUrl') ?? ''); // ベースURL（初期値は空文字）
  const [source, setSource] = useState(() => localStorage.getItem('source') ?? 'instagram');
  const [campaign, setCampaign] = useState(() => localStorage.getItem('campaign') ?? '');

  // コピー完了の文字切替
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('baseUrl', baseUrl);
    localStorage.setItem('source', source);
    localStorage.setItem('campaign', campaign);
  }, [baseUrl, source, campaign]);

  // baseUrlが入力されている時だけ、後ろにパラメータをくっつける
  const generatedUrl = baseUrl ? `${baseUrl}?utm_source=${source}&utm_medium=social&utm_campaign=${campaign}` : '';

  // コピーボタンの処理
  const handleCopy = () => {
    // PCのクリップボードにURLコピー
    navigator.clipboard.writeText(generatedUrl);

    // コピー完了の文字に切り替える
    setIsCopied(true);

    // 2秒後に元の状態に戻す
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <Card>
      <FormLayout>
        <Text as="h2" variant="headingMd">
          UTMパラメータ生成ツール 🔗
        </Text>

        <TextField
          label="飛ばしたいURL（必須）"
          value={baseUrl}
          onChange={setBaseUrl}
          autoComplete="off"
          placeholder="https://your-store.com/products/xxx"
        />

        <Select label="参照元 (utm_source)" options={SOURCE_OPTIONS} onChange={setSource} value={source} />

        <TextField
          label="キャンペーン名 (utm_campaign)"
          value={campaign}
          onChange={setCampaign}
          autoComplete="off"
          placeholder="spring_sale"
        />

        {/* URLが生成された時だけ結果を表示 */}
        {generatedUrl && (
          <Box paddingBlockStart="400" padding="400" background="bg-surface-secondary" borderRadius="200">
            <BlockStack gap="200">
              <Text as="p" fontWeight="bold">
                生成されたURL:
              </Text>
              <Text as="p">{generatedUrl}</Text>
              <InlineStack gap="200">
                <Button onClick={handleCopy}>{isCopied ? 'コピーしました' : 'URLをコピー'}</Button>
              </InlineStack>
            </BlockStack>
          </Box>
        )}
      </FormLayout>
    </Card>
  );
};

export default UtmGenerator;
