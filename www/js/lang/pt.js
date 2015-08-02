angular.module("starter.config")
.config(function($translateProvider) {


    $translateProvider.translations('pt', {
        app_name: 'Livrio',
        required_field: 'é obrigatório',
        refresh: 'Atualizar',
        loading: 'Carregando',
        welcome: 'Olá <strong>{0}</strong>, seja bem vindo ao <strong>Livrio</strong> uma rede de compartilhamento de livros entre amigos. Comece já cadastrando seus livros e disponibilizando-os para seus amigos.',
        offline: 'Você precisa estar conectado a internet. Por favor verifique sua conexão',
        backbutton: 'Precione o botão voltar para sair',

        login: {
            loading_login: 'Entrando...',
            loading_create: 'Cadastrando...',
            loading_facebook: 'Conectando ao Facebook',
            email_duplicate: '<strong>Email</strong> já cadastrado!',
            login_invalid: '<strong>Email</strong> e/ou <strong>Senha</strong> estão incorretos.',

            tab_login: 'Login',
            tab_create: 'Cadastre-se',
            field_email: 'E-mail',
            field_password: 'Senha',
            btn_login: 'Entrar',
            btn_facebook: 'Entrar com o Facebook',
            terms: 'Ao clicar em "Entrar com o Facebook" ou "Cadastrar", você concorda com os Termos de Serviços e Política de Privacidade do Livrio.',

            btn_create: 'Cadastrar',
            field_name: 'Nome completo'

        },

        menu: {
            my_books: 'Minha bibliotéca',
            my_friends: 'Amigos',
            my_loans: 'Empréstimos',
            notifications: 'Notificações',
            search: 'Procurar livro',
            shelfs: 'Estantes',
            empty_shelfs: 'Nenhuma estante criada',
            profile: 'Meu perfil',
            config: 'Configurações',
            about: 'Sobre o aplicativo',
            exit: 'Sair'
        },
        about: {
            title: 'Sobre o Livrio',
            terms: 'Termos Legais',
            policy: 'Termos de uso e Política de Privacidade',
            about_app: 'Sobre este aplicativo',
            version: 'Versão Android {{value}}'
        },
        profile: {
            title: 'Perfil de usuário',
            btn_save: 'Salvar',
            field_name: 'Nome',
            field_birthday: 'Data de Nascimento',
            field_gender: 'Sexo',
            field_email:'E-mail',
            gender_male: 'Masculino',
            gender_female: 'Feminino',
            info: 'Caro usuário, as informações sobre sexo e data de nascimento são utilizadas para sugerirmos livros que melhor se adequam a você.',

            sheet_title: 'Foto de perfil',
            sheet_cancel: 'Cancelar',
            sheet_photo: 'Tirar foto',
            sheet_picture: 'Imagem',
            sheet_remove: 'Remover foto',

            toast_save: 'Salvo!',
            toast_photo_error: 'Não foi possível alterar a foto!'


        },
        config: {
            title: 'Configurações',
            allow_search_by_email: 'Permitir que me econtrem pelo e-mail',
            allow_notification_push: 'Permitir notificações push',
            allow_notification_email: 'Permitir notificações por e-mail'
        },
        library: {
            title: 'Minha biblioteca',
            page: 'Páginas',
            empty_list: 'Clique no "+" para cadastrar seus livros'
        },
        friends: {
            title: 'Meus amigos',
            empty_list: 'Você ainda não possui amigos',
            info_facebook: 'Você ainda não conectou o <strong>Livrio</strong> ao seu Facebook. Conecte-se para que seus amigos tenham acesso aos seus livros.',
            btn_facebook: 'Conectar ao Facebook',
            book: 'Livros',

            //listagem de livros de amigos
            empty_list_book: 'Seu amigo ainda não cadastrou nenhum livro',
            page: 'Páginas',

            toast_request_friend: 'Solicitação enviada!',
            toast_friend: 'Vocês são amigos agora!',

            invite_msg: 'Oi, agora todos os meus livros estão disponíveis no Livrio',
            invite_subject: 'Conheça meus livros',
            invite_link: 'https://goo.gl/XQHPDi'

        },
        add_friend: {
            title: 'Encontrar amigos',
            empty_list: 'Utilize a pesquisa',
            empty_list_search: 'Não há usuários com este nome',
            placeholder: 'Procurar pelo nome ou por e-mail'
        },
        loan: {
            title: 'Empréstimos',
            my_books: 'Meus livros',
            friend_books: 'Livros de amigos',
            page: 'Página',
            empty_list: 'Ainda não foram feitos empréstimos',

            toast_request_cancel: 'Solicitação cancelada!',
            toast_request: 'Solicitação enviada!',
            toast_loan_cancel: 'Empréstimo cancelado!',
            toast_request_loan: 'Solicitação enviada!',
            title_loan: 'Empréstimo',

            msg_loan_info: 'Empréstimo realizado!<br />Agora entre em contato com seu amigo para efetuar a entrega do livro.',

            option_day: 'Dia',
            option_week: 'Semana',
            option_month: 'Mês',

            popup_title: 'Duração do emprestimo',
            popup_title_2: 'Solicitação de empréstimo',
            popup_btn_cancel: 'Cancelar',
            popup_btn_ok: 'Confirmar',
            popup_btn_request: 'Confirmar',

            loading_loan: 'Emprestando'


        },
        notification: {
            title: 'Notificações',
            empty_list: 'Você não tem nenhuma notificação',

            msg_loan_request: '<span>{0}</span> solicitou empréstimo do livro <span>{1}</span>',
            msg_loan_confirm_yes: '<span>{0}</span> já entregou o livro <span>{1}</span>',
            msg_loan_confirm_no: '<span>{0}</span> cancelou o empréstimo do livro <span>{1}</span>',
            msg_loan_request_return: '<span>{0}</span> solicitou devolução do livro <span>{1}</span>',
            msg_loan_return_confirm: '<span>{0}</span> devolveu o livro <span>{1}</span>',
            msg_loan_confirm: '<span>{0}</span> deseja te emprestar o livro <span>{1}</span>',
            msg_request_friend: '<span>{0}</span> quer ser seu amigo no Livrio.',
            msg_friend: '<span>{0}</span> é seu amigo agora.',

            time_now: 'agora',
            time_minute: 'há 1 minuto',
            time_n_minute: 'há {0} minutos',
            time_hour: 'há 1 hora',
            time_n_hour: 'há {0} horas',
            time_yesterday: 'Ontem',
            time_days: 'há {0} dias',
            time_week: 'há {0} semanas',

            question_friend_title: 'Solicitação de amizade',
            question_friend_yes: 'Aceitar',
            question_friend_no: 'Recusar',
            question_friend_msg: 'Você deseja aceitar a soliciação de amizade de <strong>{0}</strong>'

        },
        search: {
            loading: 'Pesquisando',
            title: 'Procurar livros',
            placeholder: 'Título, Autor, Editora, ISBN...',
            empty_list: 'Utilize o campo acima para pesquisar',
            empty_search: 'não encontramos nenhum livro que corresponda a sua busca',
            page: 'Páginas',
            book_friend: 'Livros de amigos'
        },
        book: {
            isbn: 'ISBN',
            author: 'Autor(res)',
            page: 'Páginas',
            publisher: 'Editora',
            synopsis: 'Sinópse',
            late:'Devolução atrasada',
            btn_start_loan: 'Emprestar este livro',
            btn_request_book: 'Solicitar este livro emprestado',
            date: 'Data',
            days: 'Dias restantes',
            btn_cancel_request: 'Cancelar solicitação',
            btn_return: 'Devolver',
            btn_confirm_loan: 'Confirmar',
            btn_cancel_loan: 'Cancelar empréstimo',
            btn_request_return: 'Solicitar devolução',
            question_confirm_loan: 'Deseja emprestar este livro?',
            question_yes: 'Sim',
            question_no: 'Não',

            //tela de emprestimo
            title_loan:'Emprestar livro',

            //popup delete
            question_delete: 'Deseja excluir este livro?',
            question_delete_yes: 'Excluir',
            question_delete_no: 'Cancelar',
            wait_delete: 'Exluindo...',
            toast_delete: 'Livro excluido!',
            msg_delete_lock: 'Você não pode excluir um livro que está emprestado',

            toast_request_return: 'Seu amigo será avisado!',
            toast_request_return_duplicate: 'Já existe uma solicitação pendente!',
            toast_cover_update: 'Capa atualizada!',

            sheet_title: 'Capa do livro: ',
            sheet_photo: 'Tirar foto',
            sheet_picture: 'Galeria',
            sheet_update: 'Editar',
            sheet_change_cover: 'Alterar capa',
            sheet_request_return: 'Solicitar devolução',
            sheet_loan: 'Emprestar',
            sheet_delete: 'Excluir',
            sheet_cancel: 'Cancelar'

        },
        shelf: {
            page: 'Página',
            empty_list: 'Nenhum livro nesta estante',
            popup_create_title: 'Nova estante',
            popup_create_msg: 'Qual o nome da estante?',
            popup_create_cancel: 'Cancelar',
            popup_create_ok: 'Criar',
            toast_create: 'Estante criada!',

            popup_update_title: 'Editar estante',
            popup_update_msg: 'Qual o novo nome da estante?',
            popup_update_cancel: 'Cancelar',
            popup_update_ok: 'Editar',
            toast_update: 'Estante atualizada!',

            popup_delete_title: 'Deseja excluir esta estante?',
            popup_delete_msg: 'Os livros não serão excĺuídos!',
            popup_delete_cancel: 'Cancelar',
            popup_delete_ok: 'Excluir',
            toast_delete: 'Estante excluída!'

        },
        book_form: {

            isbn_searching: 'Pesquisando...',
            isbn_duplicate: "O livro <strong>{0}</strong> já está cadastrado!",
            isbn_duplicate_notice: "Este livro já está cadastrado",

            saving: 'Salvando...',

            toast_create: 'Livro inserido!',
            toast_update: 'Livro atualizado',



            title_create: 'Novo Livro',
            title_update: 'Editar Livro',
            field_isbn: 'ISBN',
            field_title: 'Título',
            field_author: 'Autor',
            cover: 'Capa',
            shelf:'Estantes',
            shelf_empty: 'Nenhuma estante',
            field_publisher: 'Editora',
            field_publisher_year: 'Ano de publicação',
            field_page: 'Páginas',

            btn_save: 'Salvar',
            btn_shelf_cancel: 'Cancelar',
            btn_shelf_save: 'Salvar',
            btn_add_shelf: 'Criar estante'

        }


    });
});
