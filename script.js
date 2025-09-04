// Configurações do Airtable
// Agora usando proxy local para evitar problemas de CORS
const AIRTABLE_TABLE_NAME = 'Clientes';
let AIRTABLE_BASE_ID = '';
let AIRTABLE_URL = '';

// Função para carregar configurações do servidor
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const config = await response.json();
            AIRTABLE_BASE_ID = config.AIRTABLE_BASE_ID;
            // Usar proxy local em vez da URL direta do Airtable
            AIRTABLE_URL = `/api/airtable/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
            console.log('✅ Configuração carregada com sucesso!');
            console.log('📡 URL do proxy:', AIRTABLE_URL);
            return true;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar configuração:', error);
        showAlert('Erro ao carregar configurações. Verifique as variáveis de ambiente.', 'error');
    }
    return false;
}

// Elementos do DOM
const clientForm = document.getElementById('clientForm');
const clientsList = document.getElementById('clientsList');
const alertBox = document.getElementById('alertBox');
const submitBtn = document.getElementById('submitBtn');

// Estado da aplicação
let editingId = null;
let clients = [];

/**
 * Função para mostrar alertas na interface
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de alerta (success ou error)
 */
function showAlert(message, type = 'success') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    alertBox.style.display = 'block';
    
    // Forçar reflow para ativar a animação
    alertBox.offsetHeight;
    
    // Esconder o alerta após 5 segundos com animação
    setTimeout(() => {
        alertBox.style.transform = 'translateY(-20px) scale(0.95)';
        alertBox.style.opacity = '0';
        
        setTimeout(() => {
            alertBox.style.display = 'none';
            alertBox.classList.remove('show');
        }, 300);
    }, 5000);
}

/**
 * Configura os headers para as requisições HTTP
 * @returns {Object} Headers configurados
 */
function getHeaders() {
    return {
        'Content-Type': 'application/json'
        // A autorização agora é tratada pelo servidor proxy
    };
}

/**
 * Busca todos os clientes do Airtable
 */
async function fetchClients() {
    try {
        
        // Mostrar estado de carregamento
        clientsList.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <div style="margin-top: 1rem; text-align: center;">
                    <p><strong>🔄 Carregando clientes...</strong></p>
                    <p style="font-size: 0.9rem; color: var(--gray);">
                        Conectando via proxy local: ${AIRTABLE_URL}
                    </p>
                </div>
            </div>
        `;

        // Fazer requisição para a API do Airtable
        const response = await fetch(AIRTABLE_URL, {
            headers: getHeaders()
        });


        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na resposta:', errorText);
            
            let errorMessage = `Status ${response.status}: `;
            switch(response.status) {
                case 401:
                    errorMessage += 'Chave de API inválida ou expirada';
                    break;
                case 403:
                    errorMessage += 'Acesso negado - verifique as permissões da API';
                    break;
                case 404:
                    errorMessage += 'Base ou tabela não encontrada';
                    break;
                case 422:
                    errorMessage += 'Parâmetros da requisição inválidos';
                    break;
                default:
                    errorMessage += errorText || 'Erro desconhecido';
            }
            
            throw new Error(errorMessage);
        }

        // Processar resposta
        const data = await response.json();
        
        clients = data.records || [];

        // Renderizar clientes na interface
        renderClients();
    } catch (error) {
        console.error('❌ Erro completo:', error);
        
        let diagnosticInfo = '';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            diagnosticInfo = `
                <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 5px; font-size: 0.9rem;">
                    <strong>🔍 Diagnóstico:</strong><br>
                    • Problema de conexão com o proxy local<br>
                    • Verifique se o servidor está rodando corretamente<br>
                    • Certifique-se de que as variáveis de ambiente estão configuradas<br><br>
                    <strong>📋 Configurações atuais:</strong><br>
                    • URL do Proxy: <code>${AIRTABLE_URL}</code><br>
                    • Base ID: <code>${AIRTABLE_BASE_ID}</code><br>
                    • Tabela: <code>${AIRTABLE_TABLE_NAME}</code>
                </div>
            `;
        }
        
        clientsList.innerHTML = `
            <div class="alert alert-error">
                <strong>❌ Erro ao carregar clientes:</strong><br>
                ${error.message}
                ${diagnosticInfo}
                <div style="margin-top: 1rem;">
                    <button onclick="fetchClients()" class="btn-sm" style="background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
                        🔄 Tentar Novamente
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Renderiza a lista de clientes na interface
 */
function renderClients() {
    // Verificar se não há clientes
    if (clients.length === 0) {
        clientsList.innerHTML = `
            <div class="empty-state">
                <i>📝</i>
                <h3>Nenhum cliente cadastrado</h3>
                <p>Adicione seu primeiro cliente usando o formulário acima.</p>
            </div>
        `;
        return;
    }

    // Gerar HTML para cada cliente com animações escalonadas
    const html = `
        <div class="grid">
            ${clients.map((client, index) => `
                <div class="client-card" 
                     data-id="${client.id}" 
                     style="--client-delay: ${index * 0.1}s; animation-delay: var(--client-delay);">
                    <div class="client-name">${client.fields?.Nome || 'Sem nome'}</div>
                    <div class="client-info">
                        <i>✉️</i> ${client.fields?.Email || 'Não informado'}
                    </div>
                    <div class="client-info">
                        <i>📞</i> ${client.fields?.Telefone || 'Não informado'}
                    </div>
                    <div class="actions">
                        <button class="btn-edit btn-sm" onclick="editClient('${client.id}')" title="Editar cliente">
                            <span>✏️</span> Editar
                        </button>
                        <button class="btn-danger btn-sm" onclick="deleteClient('${client.id}')" title="Excluir cliente">
                            <span>🗑️</span> Excluir
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    clientsList.innerHTML = html;
}

/**
 * Salva um cliente (cria ou atualiza)
 * @param {Object} clientData - Dados do cliente a serem salvos
 */
async function saveClient(clientData) {
    try {
        let url = AIRTABLE_URL;
        let method = 'POST';

        // Se estiver editando, altera a URL e o método
        if (editingId) {
            url += `/${editingId}`;
            method = 'PATCH';
        }

        // Fazer requisição para salvar os dados
        const response = await fetch(url, {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify({
                fields: {
                    Nome: clientData.name,
                    Email: clientData.email,
                    Telefone: clientData.phone
                }
            })
        });

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao ${editingId ? 'atualizar' : 'criar'} cliente: ${response.status}`);
        }

        // Mostrar mensagem de sucesso
        showAlert(
            editingId ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!',
            'success'
        );

        // Resetar o formulário
        clientForm.reset();
        editingId = null;
        submitBtn.textContent = 'Cadastrar Cliente';

        // Recarregar a lista de clientes
        fetchClients();
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao salvar cliente. Tente novamente.', 'error');
    }
}

/**
 * Preenche o formulário para edição de um cliente
 * @param {string} id - ID do cliente a ser editado
 */
function editClient(id) {
    const client = clients.find(c => c.id === id);

    if (client) {
        // Preencher formulário com dados do cliente
        document.getElementById('name').value = client.fields.Nome || '';
        document.getElementById('email').value = client.fields.Email || '';
        document.getElementById('phone').value = client.fields.Telefone || '';

        // Atualizar estado para modo de edição
        editingId = id;
        submitBtn.textContent = 'Atualizar Cliente';

        // Scroll para o formulário
        clientForm.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Exclui um cliente
 * @param {string} id - ID do cliente a ser excluído
 */
async function deleteClient(id) {
    // Confirmar exclusão
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }

    try {
        // Fazer requisição para excluir
        const response = await fetch(`${AIRTABLE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao excluir cliente: ${response.status}`);
        }

        // Mostrar mensagem de sucesso
        showAlert('Cliente excluído com sucesso!', 'success');

        // Recarregar lista de clientes
        fetchClients();
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao excluir cliente. Tente novamente.', 'error');
    }
}

// Event listener para o formulário
clientForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obter dados do formulário
    const clientData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim()
    };

    // Validação básica
    if (!clientData.name || !clientData.email || !clientData.phone) {
        showAlert('Por favor, preencha todos os campos.', 'error');
        return;
    }

    // Salvar cliente
    saveClient(clientData);
});

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    
    // Carregar configurações do servidor
    const configLoaded = await loadConfig();
    
    if (!configLoaded || !AIRTABLE_BASE_ID) {
        showAlert('Erro ao carregar configurações. Verifique se as variáveis de ambiente estão configuradas.', 'error');
        return;
    }

    // Carregar clientes
    fetchClients();
});