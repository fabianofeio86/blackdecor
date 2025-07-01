from flask import Blueprint, request, jsonify
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

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

        message = Mail(
            from_email='contato@blackpeliculas.com.br',
            to_emails='contato@blackpeliculas.com.br',
            subject=f'Nova solicitação de orçamento - {nome}',
            plain_text_content=email_body
        )

        sg = SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)

        if 200 <= response.status_code < 300:
            return jsonify({
                'success': True,
                'message': 'Solicitação enviada com sucesso! Entraremos em contato em breve.'
            })
        else:
            return jsonify({'error': 'Erro ao enviar e-mail (SendGrid)'}), 500

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Erro interno no servidor'}), 500

@contact_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})



