import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с базой статей УК РФ - поиск, получение информации
    Args: event - dict с httpMethod, queryStringParameters (search, code)
          context - объект с request_id
    Returns: HTTP response с данными статей
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
    search_query = params.get('search', '')
    article_code = params.get('code', '')
    
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
        if article_code:
            cur.execute(
                "SELECT id, code, title, description, category, punishment FROM articles WHERE code = %s",
                (article_code,)
            )
            row = cur.fetchone()
            if row:
                result = {
                    'id': row[0],
                    'code': row[1],
                    'title': row[2],
                    'description': row[3],
                    'category': row[4],
                    'punishment': row[5]
                }
            else:
                result = None
        
        elif search_query:
            search_pattern = f"%{search_query}%"
            cur.execute(
                """
                SELECT id, code, title, description, category, punishment 
                FROM articles 
                WHERE code ILIKE %s OR title ILIKE %s OR description ILIKE %s
                ORDER BY code
                LIMIT 20
                """,
                (search_pattern, search_pattern, search_pattern)
            )
            rows = cur.fetchall()
            result = [{
                'id': row[0],
                'code': row[1],
                'title': row[2],
                'description': row[3],
                'category': row[4],
                'punishment': row[5]
            } for row in rows]
        
        else:
            cur.execute(
                """
                SELECT id, code, title, description, category, punishment 
                FROM articles 
                ORDER BY code 
                LIMIT 50
                """
            )
            rows = cur.fetchall()
            result = [{
                'id': row[0],
                'code': row[1],
                'title': row[2],
                'description': row[3],
                'category': row[4],
                'punishment': row[5]
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
