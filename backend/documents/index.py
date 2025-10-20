import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с библиотекой процессуальных документов
    Args: event - dict с httpMethod, queryStringParameters (category)
          context - объект с request_id
    Returns: HTTP response с данными документов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    category = params.get('category', '')
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration error'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    try:
        if category:
            cur.execute(
                """
                SELECT id, title, category, code, description 
                FROM documents 
                WHERE category = %s
                ORDER BY title
                """,
                (category,)
            )
        else:
            cur.execute(
                """
                SELECT id, title, category, code, description 
                FROM documents 
                ORDER BY category, title
                """
            )
        
        rows = cur.fetchall()
        result = [{
            'id': row[0],
            'title': row[1],
            'category': row[2],
            'code': row[3],
            'description': row[4]
        } for row in rows]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result, ensure_ascii=False)
        }
    
    finally:
        cur.close()
        conn.close()
