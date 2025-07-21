const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const results = [];

fs.createReadStream(path.resolve(__dirname, 'n5.csv'))
  .pipe(csv())
  .on('data', (data) => {
    const word = {
      level: 'n5',
      kanji: data['expression'],
      furigana: data['reading'],
      example_sentence: '추후작업',
      answer_in_example: '추후작업',
      meanings: [
        {
          language_code: 'ko',
          word_meaning: '추후작업',
          example_sentence_meaning: '추후작업'
        },
        {
          language_code: 'en',
          word_meaning: data['meaning'],
          example_sentence_meaning: '추후작업'
        }
      ]
    };
    results.push(word);
  })
  .on('end', () => {
    fs.writeFileSync(
      path.resolve(__dirname, 'n5.json'),
      JSON.stringify(results, null, 2),
      'utf-8'
    );
    console.log('✅ JSON 파일 생성 완료: n5.json');
  });
