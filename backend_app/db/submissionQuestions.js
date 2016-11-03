import db from './';

const list = (showArchived = false) => new Promise((resolve, reject) => {
  const defaultColumns = ['id', 'title'];
  const columns = showArchived ? defaultColumns.concat('archived') : defaultColumns;
  const clause = showArchived ? '' : 'WHERE archived = false';
  const query = `SELECT $<columns:name> FROM submission_questions ${clause}`;
  db.manyOrNone(query, { columns }).then(resolve).catch(reject);
});

const destroy = id => new Promise((resolve, reject) => {
  const query = 'UPDATE submission_questions SET archived = true WHERE id = $<id>';
  db.oneOrNone(query, { id }).then(resolve).catch(reject);
});

const create = title => new Promise((resolve, reject) => {
  const query = `
    INSERT INTO submission_questions (title) VALUES ($<title>)
    ON CONFLICT (title) DO UPDATE SET archived = false
    RETURNING id`;
  db.one(query, { title }).then(resolve).catch(reject);
});

export default {
  list,
  destroy,
  create,
};
