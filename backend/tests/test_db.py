from backend.database.queries import get_sql, add_sql_clause

sql = """ SELECT * FROM macrostrat.projects; """
    
def test_db_exists(db):
    
    res = db.execute(sql).fetchall()
    for project in res:
        assert project.get('project', False)
        assert project.get('descrip', False)

    assert len(res) > 0

def test_db_utils(db):
    addition = "WHERE {col} = {id}"
    sql = get_sql("get-cols-by.sql")
    sql = add_sql_clause(sql, addition)

    assert addition in sql
    