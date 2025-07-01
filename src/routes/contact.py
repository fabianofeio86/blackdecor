from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()
        
        required_fields = ['nome', 'telefone', 'email', 'projeto']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        nome = data.get('nome')
        telefone = data.get('telefone')
        email = data.get('email')
        projeto = data.get('projeto')
        mensagem = data.get('mensagem', '')
        
        email_body = f"""
        Nova solicitação de orçamento - Black Decor
        
        Nome: {nome}
        Telefone: {telefone}
        E-mail: {email}
        Tipo de Projeto: {projeto}
        Mensagem: {mensagem}
        
        ---
        Enviado através da landing page Black Decor
        """
        
        msg = MIMEMultipart()
        msg['From'] = os.getenv("EMAIL_USER")  # <- Enviando de quem vai autenticar
        msg['To'] = os.getenv("EMAIL_RECEIVER")
        msg['Subject'] = f'Nova solicitação de orçamento - {nome}'
        msg.attach(MIMEText(email_body, 'plain'))
        
        smtp_host = os.getenv("EMAIL_HOST")
        smtp_port = int(os.getenv("EMAIL_PORT"))
        smtp_user = os.getenv("EMAIL_USER")
        smtp_pass = os.getenv("EMAIL_PASSWORD")
        smtp_receiver = os.getenv("EMAIL_RECEIVER")

        try:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, smtp_receiver, msg.as_string())
            server.quit()
            return jsonify({
                'success': True,
                'message': 'Solicitação enviada com sucesso! Entraremos em contato em breve.'
            })
        except Exception as smtp_error:
            import traceback
            traceback.print_exc()
            return jsonify({'error': f'Erro ao enviar e-mail: {str(smtp_error)}'}), 500

    except Exception as geral:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Erro interno no servidor'}), 500

@contact_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})


