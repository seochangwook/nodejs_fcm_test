/* DB Info */
module.exports = 
{
    user : process.env.NODEORACLEDB_USER || "system",
    password : process.env.NODEORACLEDB_PASSWORD || 'oracle',
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/orcl12c"
}