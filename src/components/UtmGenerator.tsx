import { useState } from 'react';
import { Card, FormLayout, TextField, Select, Text, Button } from '@shopify/polaris';

const UtmGenerator = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [source, setSource] = useState('instagram');
  const [campaign, setCampaign] = useState('');

  // コピー完了の文字切替
  const [isCopied, setIsCopied] = useState(false);

  const sourceOptions = [
    { label: 'Instagram', value: 'instagram' },
    { label: 'X (Twitter)', value: 'twitter' },
    { label: 'LINE配信', value: 'line' },
    { label: 'メルマガ', value: 'newsletter' },
  ];

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

        <Select label="参照元 (utm_source)" options={sourceOptions} onChange={setSource} value={source} />

        <TextField
          label="キャンペーン名 (utm_campaign)"
          value={campaign}
          onChange={setCampaign}
          autoComplete="off"
          placeholder="spring_sale"
        />

        {/* URLが生成された時だけ結果を表示 */}
        {generatedUrl && (
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f4f6f8', borderRadius: '8px' }}>
            <Text as="p" fontWeight="bold">
              生成されたURL:
            </Text>
            <Text as="p">{generatedUrl}</Text>
            <Button onClick={handleCopy}>{isCopied ? 'コピーしました' : 'URLをコピー'}</Button>
          </div>
        )}
      </FormLayout>
    </Card>
  );
};

export default UtmGenerator;
