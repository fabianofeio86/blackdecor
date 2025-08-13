from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
@cross_origin()
def submit_contact():
    try:
        data = request.get_json()
        
        # Validação dos dados obrigatórios
        required_fields = ['name', 'phone', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Extrair dados do formulário
        name = data.get('name')
        phone = data.get('phone')
        email = data.get('email')
        project_type = data.get('projectType', 'Não especificado')
        message = data.get('message', '')
        
        # Criar conteúdo do email
        email_content = f"""
        Nova solicitação de orçamento - Black Decor
        
        Nome: {name}
        Telefone/WhatsApp: {phone}
        E-mail: {email}
        Tipo de Projeto: {project_type}
        Mensagem: {message}
        
        Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}
        """
        
        # Log da solicitação (para desenvolvimento)
        print(f"Nova solicitação de contato recebida:")
        print(f"Nome: {name}")
        print(f"Email: {email}")
        print(f"Telefone: {phone}")
        print(f"Tipo de Projeto: {project_type}")
        print(f"Mensagem: {message}")
        
        # Aqui você pode adicionar a lógica para enviar email
        # Por enquanto, vamos apenas retornar sucesso
        
        return jsonify({
            'success': True,
            'message': 'Solicitação enviada com sucesso! Entraremos em contato em breve.'
        }), 200
        
    except Exception as e:
        print(f"Erro ao processar formulário: {str(e)}")
        return jsonify({
            'error': 'Erro interno do servidor. Tente novamente mais tarde.'
        }), 500

@contact_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'Black Decor Contact API'}), 200

