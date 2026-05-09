export type SkipForecastOperator = '>' | '<' | '>=' | '<=' | '==' | '!=';

export interface SkipForecastRule {
  field: string;
  operator: SkipForecastOperator;
  value: string | number;
}

export interface SkipForecastRuleGroup {
  logic: 'AND';
  rules: SkipForecastRule[];
}

/**
 * Evaluates whether forecasting should be skipped for a given article.
 *
 * The top-level array is evaluated with OR semantics: if any group matches, the
 * article is skipped. Within each group all rules must match (AND semantics).
 *
 * Unknown fields in `data` are treated as non-matching so that a missing value
 * never accidentally causes a skip.
 */
export function shouldSkipForecast(
  groups: SkipForecastRuleGroup[],
  data: Record<string, any>,
): boolean {
  if (!groups || groups.length === 0) return false;
  if (!data) return false;

  return groups.some((group) => evaluateGroup(group, data));
}

function evaluateGroup(
  group: SkipForecastRuleGroup,
  data: Record<string, any>,
): boolean {
  return group.rules.every((rule) => evaluateRule(rule, data));
}

function evaluateRule(
  rule: SkipForecastRule,
  data: Record<string, any>,
): boolean {
  if (!(rule.field in data) || data[rule.field] == null) return false;

  const actual = Number(data[rule.field]);
  const expected = Number(rule.value);

  if (isNaN(actual) || isNaN(expected)) {
    // Fall back to string comparison for non-numeric fields
    const actualStr = String(data[rule.field]);
    const expectedStr = String(rule.value);
    switch (rule.operator) {
      case '==':
        return actualStr === expectedStr;
      case '!=':
        return actualStr !== expectedStr;
      default:
        return false; // ordering operators don't apply to strings
    }
  }

  switch (rule.operator) {
    case '>':
      return actual > expected;
    case '<':
      return actual < expected;
    case '>=':
      return actual >= expected;
    case '<=':
      return actual <= expected;
    case '==':
      return actual === expected;
    case '!=':
      return actual !== expected;
    default:
      return false;
  }
}
