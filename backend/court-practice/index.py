import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для поиска судебной практики по статьям УК РФ
    Args: event - dict с httpMethod, queryStringParameters (article_code)
          context - объект с request_id
    Returns: HTTP response с судебной практикой
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
    article_code = params.get('article_code', '')
    
    if not article_code:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'article_code parameter is required'})
        }
    
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
        cur.execute(
            """
            SELECT id, article_code, case_number, court_name, decision_date, 
                   decision_type, summary, verdict, url
            FROM court_practice 
            WHERE article_code ILIKE %s
            ORDER BY decision_date DESC
            LIMIT 50
            """,
            (f"%{article_code}%",)
        )
        
        rows = cur.fetchall()
        result = [{
            'id': row[0],
            'article_code': row[1],
            'case_number': row[2],
            'court_name': row[3],
            'decision_date': row[4].isoformat() if row[4] else None,
            'decision_type': row[5],
            'summary': row[6],
            'verdict': row[7],
            'url': row[8]
        } for row in rows]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'total': len(result),
                'article_code': article_code,
                'cases': result
            }, ensure_ascii=False)
        }
    
    finally:
        cur.close()
        conn.close()
