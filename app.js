// Inicializando Supabase
const { createClient } = supabase;
const supabaseUrl = 'https://cumgzaecxbapcxggqltq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bWd6YWVjeGJhcGN4Z2dxbHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxODIwNDIsImV4cCI6MjA0Mzc1ODA0Mn0.C4jHwGpvhAfvQFEUFlSGumZDOkuCk7Fjc10wAr6lkjo';
const _supabase = createClient(supabaseUrl, supabaseKey);

// Login padrão do administrador
const adminUsername = "admin";
const adminPassword = "admin";

// Verificação de login por nome de usuário
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === adminUsername && password === adminPassword) {
        showWelcomeMessage("Admin", "Administrador");
        document.getElementById("adminPanel").classList.remove("hidden");
    } else {
        const { data: user } = await _supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (!user) {
            alert("Nome de usuário não encontrado.");
            return;
        }

        if (user.password_hash !== password) {
            alert("Senha incorreta.");
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        showWelcomeMessage(user.full_name, user.role);

        if (user.role === "fiscal") {
            document.getElementById("fiscalPanel").classList.remove("hidden");
        } else if (user.role === "client") {
            document.getElementById("clientPanel").classList.remove("hidden");
            loadClientReports();
        }
    }

    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("userHeader").classList.remove("hidden");
});

function showWelcomeMessage(name, role) {
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = `Bem-vindo, ${name} (${role})`;
}

// Logout
document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem('currentUser');
    location.reload();
});

// Criação de usuário
document.getElementById("createUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value;
    const username = document.getElementById("newUsername").value;
    const cpf = document.getElementById("cpf").value;
    const password = document.getElementById("newUserPassword").value;
    const role = document.getElementById("role").value;

    const { data: existingUser } = await _supabase
        .from("users")
        .select("*")
        .or(`username.eq.${username},cpf.eq.${cpf}`)
        .single();

    if (existingUser) {
        alert("Nome de usuário ou CPF já existem. Escolha outro.");
        return;
    }

    const { error } = await _supabase
        .from("users")
        .insert([{ full_name: fullName, username, cpf, password_hash: password, role }]);

    if (error) {
        alert("Erro ao criar o usuário.");
    } else {
        alert(`Usuário ${role} criado com sucesso!`);
    }
});

// Criação de relatório pelo fiscal
document.getElementById("createReportForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.getElementById("reportContent").value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'fiscal') {
        alert("Acesso negado.");
        return;
    }

    const { error } = await _supabase
        .from("reports")
        .insert([{ report_content: content, fiscal_id: currentUser.id }]);

    if (error) {
        alert("Erro ao criar relatório.");
    } else {
        alert("Relatório criado com sucesso!");
    }
});

// Carregar relatórios para clientes
async function loadClientReports() {
    const { data: reports } = await _supabase
        .from("reports")
        .select("*")
        .eq("status", "approved");

    const clientReports = document.getElementById("clientReports");
    clientReports.innerHTML = '';
    reports.forEach(report => {
        const reportStatus = report.status_client === 'seen' ? ' (Visto)' : '';
        clientReports.innerHTML += `
            <li>${report.report_content} ${reportStatus} 
                ${report.status_client !== 'seen' ? `<button onclick="markReportAsSeen('${report.id}')" class="bg-green-500 text-white px-2 py-1 rounded-md">Confirmar Visualização</button>` : ''}
            </li>
        `;
    });
}

// Marcar relatório como visto
async function markReportAsSeen(reportId) {
    const { error } = await _supabase
        .from("reports")
        .update({ status_client: "seen" })
        .eq("id", reportId);

    if (error) {
        alert("Erro ao confirmar visualização.");
    } else {
        alert("Relatório marcado como visto!");
        loadClientReports();
    }
}

// Carregar relatórios pendentes e aprovar
async function loadPendingReports() {
    const { data: reports } = await _supabase
        .from("reports")
        .select("*")
        .eq("status", "pending");

    const pendingReports = document.getElementById("pendingReports");
    pendingReports.innerHTML = '';
    reports.forEach(report => {
        pendingReports.innerHTML += `
            <li>${report.report_content} 
                <button onclick="approveReport('${report.id}')" class="bg-blue-500 text-white px-2 py-1 rounded-md">Aprovar</button>
            </li>`;
    });
}

async function approveReport(reportId) {
    const { error } = await _supabase
        .from("reports")
        .update({ status: "approved" })
        .eq("id", reportId);

    if (!error) {
        alert("Relatório aprovado com sucesso!");
        loadPendingReports();
    }
}

// Carregar relatórios pendentes e aprovados automaticamente
loadPendingReports();
loadClientReports();
