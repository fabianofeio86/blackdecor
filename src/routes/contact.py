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
        
        # Validar dados obrigatórios
        required_fields = ['nome', 'telefone', 'email', 'projeto']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Extrair dados do formulário
        nome = data.get('nome')
        telefone = data.get('telefone')
        email = data.get('email')
        projeto = data.get('projeto')
        mensagem = data.get('mensagem', '')
        
        # Criar o corpo do e-mail
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
        
        # Configurar e-mail
        msg = MIMEMultipart()
        msg['From'] = 'noreply@blackdecor.com'
        msg['To'] = 'contato@blackpeliculas.com.br'
        msg['Subject'] = f'Nova solicitação de orçamento - {nome}'
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Enviar e-mail via SMTP real
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
        except Exception as smtp_error:
            print(f"Erro ao enviar e-mail: {smtp_error}")
            return jsonify({'error': 'Erro ao enviar e-mail'}), 500
        
        # Salvar em arquivo para teste
        with open('/tmp/contatos.txt', 'a') as f:
            f.write(f"\n--- {nome} ---\n")
            f.write(email_body)
            f.write("\n" + "="*50 + "\n")
        
        return jsonify({
            'success': True,
            'message': 'Solicitação enviada com sucesso! Entraremos em contato em breve.'
        })
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@contact_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

