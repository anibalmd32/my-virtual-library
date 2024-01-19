import database from './connection.js'

class ORM {
  constructor (table) {
    this.table = table
  }

  async selectData ({ select = [], where = {} }) {
    const columns = this._selectParser(select)
    const { whereString, whereValues } = this._whereParser(where)

    const sql = whereString
      ? `SELECT ${columns} FROM ${this.table} WHERE ${whereString}`
      : `SELECT ${columns} FROM ${this.table}`

    try {
      const [data] = await database.execute(sql, whereValues)
      return data
    } catch (error) {
      console.log(error)
      throw new Error(`Error to select on table ${this.table}: `, error.message)
    }
  }

  async selectJoin ({
    select = [],
    join = [{
      tables: [],
      on: '',
      value: ''
    }],
    where = {}
  }) {
    const colums = this._selectParser(select)
    const joinSqlString = this._joinParser(join)
    const { whereString, whereValues } = this._whereParser(where)

    const sql = whereString
      ? `SELECT ${colums} FROM ${this.table} ${joinSqlString} WHERE ${whereString}`
      : `SELECT ${colums} FROM ${this.table} ${joinSqlString}`

    try {
      const [data] = await database.execute(sql, whereValues)
      return data
    } catch (error) {
      throw new Error(`Error to join ${this.table}: ${error}`)
    }
  }

  async insert ({ data = {} }) {
    const columns = Object.keys(data).join(', ')
    const { paramsValues, sqlParamsString } = this._insertParser(data)
    const sql = `INSERT INTO ${this.table}(${columns}) VALUES (${sqlParamsString})`

    try {
      await database.execute(sql, paramsValues)
      const newRegister = await this._getNewRegister(data)

      return newRegister
    } catch (error) {
      throw new Error(`Error to insert in ${this.table} table: ${error}`)
    }
  }

  _selectParser (selectArr) {
    const slqSelect = []
    if (selectArr.length) {
      for (const item of selectArr) {
        const itemSplited = item.split('.')

        if (itemSplited.length === 1) {
          slqSelect.push(this.table.concat(`.${item} AS ${this._crateAlias(item)}`))
        } else {
          slqSelect.push(`${item} AS ${this._crateAlias(item)}`)
        }
      }

      return slqSelect.join(', ')
    } else {
      return '*'
    }
  }

  _whereParser (whereObj) {
    const whereKeys = Object.keys(whereObj)
    const sqlWhereKeys = []
    const whereValues = []

    for (const key of whereKeys) {
      sqlWhereKeys.push(key.concat(' = ?'))
      whereValues.push(whereObj[key])
    }

    const whereString = sqlWhereKeys.join(', ')

    return {
      whereString,
      whereValues
    }
  }

  _joinParser (joinArryObj) {
    const joinSql = []

    for (const item of joinArryObj) {
      if (item.tables.length === 1) {
        joinSql.push(`INNER JOIN ${item.tables[0]} ON ${this.table}.${item.on} = ${item.tables[0]}.${item.value}`)
      } else {
        joinSql.push(`INNER JOIN ${item.tables[0]} ON ${item.tables[1]}.${item.on} = ${item.tables[0]}.${item.value}`)
      }
    }

    const joinSqlString = joinSql.join(' ')

    return joinSqlString
  }

  _insertParser (insertObj) {
    const paramsValues = []
    const paramsString = []

    for (const key in insertObj) {
      paramsValues.push(insertObj[key])
      paramsString.push('?')
    }

    const sqlParamsString = paramsString.join(', ')

    return {
      sqlParamsString,
      paramsValues
    }
  }

  _crateAlias (value) {
    if (value.includes('.')) {
      return value.split('.').join('')
    } else if (value.includes('_')) {
      return value.split('_').join('')
    } else {
      return value
    }
  }

  async _getPrimaryKey () {
    const [description] = await database.execute(`DESCRIBE ${this.table}`)
    return description.filter(column => column.Key === 'PRI').map(column => column.Field)
  }

  async _getNewRegister (columns) {
    const primaryKey = await this._getPrimaryKey()

    if (Object.keys(columns).includes(primaryKey[0])) {
      const [newRegister] = await database.execute(`
        SELECT
          ${Object.keys(columns).join(', ')}
        FROM
          ${this.table}
        WHERE
          ${primaryKey[0]} = '${columns[primaryKey]}'
      `)

      return newRegister[0]
    }
  }
}

export default ORM
