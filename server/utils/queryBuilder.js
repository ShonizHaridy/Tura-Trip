// utils/queryBuilder.js
class QueryBuilder {
  constructor() {
    this.whereConditions = [];
    this.params = [];
  }

  // Add WHERE condition with parameters
  addCondition(condition, ...parameters) {
    this.whereConditions.push(condition);
    this.params.push(...parameters);
    return this;
  }

  // Add condition only if value exists
  addIfExists(condition, value) {
    if (value !== undefined && value !== null && value !== '') {
      this.whereConditions.push(condition);
      this.params.push(value);
    }
    return this;
  }

  // Get WHERE clause
  getWhereClause() {
    return this.whereConditions.length > 0 
      ? `WHERE ${this.whereConditions.join(' AND ')}` 
      : '';
  }

  // Get copy of parameters for reuse
  getParams() {
    return [...this.params];
  }

  // Get count query with current conditions
  getCountQuery(baseTable, joins = '') {
    return `
      SELECT COUNT(DISTINCT ${baseTable}.id) as total
      FROM ${baseTable}
      ${joins}
      ${this.getWhereClause()}
    `;
  }
}

module.exports = QueryBuilder;