import {
  shouldSkipForecast,
  SkipForecastRuleGroup,
} from './forecast-rule-evaluator';

describe('shouldSkipForecast', () => {
  describe('empty / null guards', () => {
    it('returns false when rules array is empty', () => {
      expect(shouldSkipForecast([], { weight: 10 })).toBe(false);
    });

    it('returns false when rules is null', () => {
      expect(shouldSkipForecast(null as any, { weight: 10 })).toBe(false);
    });
  });

  describe('single-rule group', () => {
    const weightGt5: SkipForecastRuleGroup[] = [
      { logic: 'AND', rules: [{ field: 'weight', operator: '>', value: 5 }] },
    ];

    it('returns true when article weight exceeds threshold', () => {
      expect(shouldSkipForecast(weightGt5, { weight: 6 })).toBe(true);
    });

    it('returns true when weight equals boundary + epsilon', () => {
      expect(shouldSkipForecast(weightGt5, { weight: 5.001 })).toBe(true);
    });

    it('returns false when weight equals threshold exactly (strict >)', () => {
      expect(shouldSkipForecast(weightGt5, { weight: 5 })).toBe(false);
    });

    it('returns false when weight is below threshold', () => {
      expect(shouldSkipForecast(weightGt5, { weight: 3 })).toBe(false);
    });

    it('returns false when the field is missing from data', () => {
      expect(shouldSkipForecast(weightGt5, { price: 9.99 })).toBe(false);
    });

    it('returns false when the field value is null', () => {
      expect(shouldSkipForecast(weightGt5, { weight: null })).toBe(false);
    });
  });

  describe('all numeric operators', () => {
    const data = { value: 10 };

    it('> operator', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '>', value: 9 }],
            },
          ],
          data,
        ),
      ).toBe(true);
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '>', value: 10 }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });

    it('< operator', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '<', value: 11 }],
            },
          ],
          data,
        ),
      ).toBe(true);
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '<', value: 10 }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });

    it('>= operator', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '>=', value: 10 }],
            },
          ],
          data,
        ),
      ).toBe(true);
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '>=', value: 11 }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });

    it('<= operator', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '<=', value: 10 }],
            },
          ],
          data,
        ),
      ).toBe(true);
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '<=', value: 9 }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });

    it('== operator', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '==', value: 10 }],
            },
          ],
          data,
        ),
      ).toBe(true);
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '==', value: 99 }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });

    it('!= operator', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '!=', value: 99 }],
            },
          ],
          data,
        ),
      ).toBe(true);
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'value', operator: '!=', value: 10 }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });
  });

  describe('string field comparisons (== / !=)', () => {
    const data = { brand: 'BulkCo' };

    it('== matches equal string', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'brand', operator: '==', value: 'BulkCo' }],
            },
          ],
          data,
        ),
      ).toBe(true);
    });

    it('== does not match different string', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'brand', operator: '==', value: 'OtherBrand' }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });

    it('!= matches different string', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'brand', operator: '!=', value: 'OtherBrand' }],
            },
          ],
          data,
        ),
      ).toBe(true);
    });

    it('ordering operators return false for string fields', () => {
      expect(
        shouldSkipForecast(
          [
            {
              logic: 'AND',
              rules: [{ field: 'brand', operator: '>', value: 'A' }],
            },
          ],
          data,
        ),
      ).toBe(false);
    });
  });

  describe('AND semantics within a group', () => {
    const group: SkipForecastRuleGroup[] = [
      {
        logic: 'AND',
        rules: [
          { field: 'weight', operator: '>', value: 5 },
          { field: 'price', operator: '<', value: 10 },
        ],
      },
    ];

    it('returns true only when all AND rules pass', () => {
      expect(shouldSkipForecast(group, { weight: 6, price: 8 })).toBe(true);
    });

    it('returns false when first rule fails', () => {
      expect(shouldSkipForecast(group, { weight: 3, price: 8 })).toBe(false);
    });

    it('returns false when second rule fails', () => {
      expect(shouldSkipForecast(group, { weight: 6, price: 15 })).toBe(false);
    });

    it('returns false when both rules fail', () => {
      expect(shouldSkipForecast(group, { weight: 3, price: 15 })).toBe(false);
    });
  });

  describe('OR semantics across groups', () => {
    const groups: SkipForecastRuleGroup[] = [
      { logic: 'AND', rules: [{ field: 'weight', operator: '>', value: 5 }] },
      {
        logic: 'AND',
        rules: [
          { field: 'price', operator: '<', value: 2 },
          { field: 'brand', operator: '==', value: 'BulkCo' },
        ],
      },
    ];

    it('returns true when first group matches', () => {
      expect(
        shouldSkipForecast(groups, { weight: 10, price: 5, brand: 'X' }),
      ).toBe(true);
    });

    it('returns true when second group matches', () => {
      expect(
        shouldSkipForecast(groups, { weight: 1, price: 1, brand: 'BulkCo' }),
      ).toBe(true);
    });

    it('returns true when both groups match', () => {
      expect(
        shouldSkipForecast(groups, { weight: 10, price: 1, brand: 'BulkCo' }),
      ).toBe(true);
    });

    it('returns false when no group matches', () => {
      expect(
        shouldSkipForecast(groups, { weight: 1, price: 5, brand: 'X' }),
      ).toBe(false);
    });
  });
});
