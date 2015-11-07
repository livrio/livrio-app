angular.module("starter.config")
.config(function($translateProvider) {


    $translateProvider.translations('en', {
        app_name: 'Livrio',
        required_field: 'é obrigatório',
        refresh: 'Atualizar',
        loading: 'Carregando',
        welcome: 'Olá <strong>{0}</strong>, seja vem vindo ao <strong>Livrio</strong> um rede de compartilhamento de livros entre amigos. Comece já cadastrando seus livros e tornando-os disponíveis para seus amigos.',
        offline: 'Você precisa está conectado a internet. Por favor verifique sua conexão!',

        login: {
            loading_login: 'Entrando...',
            loading_create: 'Cadastrando...',
            loading_facebook: 'Entrando com Facebook',
            email_duplicate: '<strong>Email</strong> já cadastrado!',
            login_invalid: '<strong>Email</strong>/<strong>Senha</strong> estão incorretos.',

            tab_login: 'Login',
            tab_create: 'Create',
            field_email: 'E-mail',
            field_password: 'Password',
            btn_login: 'Enter',
            btn_facebook: 'Entrar com Facebook',
            terms: 'Ao tocar em "Entrar com Facebook" ou "Cadastrar", você concorda com os termos de Serviços e Politica de Privacidade do Livrio.',

            btn_create: 'Sign-in',
            field_name: 'Fullname'

        },

        menu: {
            my_books: 'Meus livros',
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
            terms: 'Legal',
            policy: 'Termos de uso e Policita de Privacidade',
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
            info: 'Caro usuário, as informações de sexo e data de nascimento são utilizadas para sugerir livros que melhor se encaixa com seu perfil.',

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
            allow_search_by_email: 'Permitir ser encontrado através do e-mail',
            allow_notification_push: 'Receber notificações push',
            allow_notification_email: 'Receber notificações por e-mail'
        },
        library: {
            title: 'Meus livros',
            page: 'Páginas',
            empty_list: 'Nenhum livro cadastrado'
        },
        friends: {
            title: 'Meus amigos',
            empty_list: 'Nenhum amigo',
            info_facebook: 'Você ainda não conectou o <strong>Livrio</strong> ao seu Facebook. Conecte-se para que seus amigos tenham acesso aos seus livros.',
            btn_facebook: 'Conectar ao Facebook',
            book: 'Livros',

            //listagem de livros de amigos
            empty_list_book: 'Nenhum livro para mostrar',
            page: 'Páginas',

            toast_request_friend: 'Solicitação enviada!',
            toast_friend: 'Vocês são amigos agora!',

            invite_msg: 'Oi! Agora todos os meus livros estão disponível no Livrio',
            invite_subject: 'Conheça meus livros',
            invite_link: 'https://goo.gl/XQHPDi'

        },
        add_friend: {
            title: 'Encontrar amigo',
            empty_list: 'Utilize a pesquisa',
            empty_list_search: '',
            placeholder: 'Procurar pelo nome ou por e-mail'
        },
        loan: {
            title: 'Empréstimos',
            my_book: 'Meus livros',
            friend_book: 'Livros de amigos',
            page: 'Página',
            empty_list: 'Nenhum livro',

            toast_request_cancel: 'Solicitação cancelada!',
            toast_request: 'Solicitação enviada!',
            toast_loan_cancel: 'Empréstimo cancelado!',
            toast_request_loan: 'Solicitação enviada!',
            title_loan: 'Empréstimo',

            msg_loan_info: 'Empréstimo realizado!<br />Agora entre em contato com seu amigo para efetuar a entrega do livro.'

        },
        notification: {
            title: 'Notificações',
            empty_list: 'Nenhuma notificação',

            msg_loan_request: '<span>{0}</span> solicitou empréstimo do livro <span>{1}</span>',
            msg_loan_confirm_yes: '<span>{0}</span> já entregou o livro <span>{1}</span>',
            msg_loan_confirm_no: '<span>{0}</span> cancelou o empréstimo do livro <span>{1}</span>',
            msg_loan_request_return: '<span>{0}</span> solicitou devolução do livro <span>{1}</span>',
            msg_loan_return_confirm: '<span>{0}</span> devolveu o livro <span>{1}</span>',
            msg_loan_confirm: '<span>{0}</span> te emprestou o livro <span>{1}</span>',
            msg_request_friend: '<span>{0}</span> solicitou amizade.',
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
            question_friend_no: 'Ignorar',
            question_friend_msg: 'Deseja aceitar a soliciação de amizade de <strong>{0}</strong>'

        },
        search: {
            loading: 'Pesquisando',
            title: 'Procurar livros',
            placeholder: 'Título, autor, editora, ISBN...',
            empty_list: 'Utilize a pesquisa',
            empty_search: 'nenhum livro encontrado',
            page: 'Páginas',
            book_friend: 'Livros de amigos'
        },
        book: {
            isbn: 'ISBN',
            author: 'Autor(res)',
            page: 'Páginas',
            publisher: 'Editora',
            synopsis: 'Sinopse',
            late:'Está atrasado',
            btn_start_loan: 'Emprestar este livro',
            btn_request_book: 'Solicitar emprestimo deste livro',
            date: 'Data',
            days: 'dias restantes',
            btn_cancel_request: 'Cancelar solicitação',
            btn_return: 'Devolver',
            btn_confirm_loan: 'Confirmar empréstimo',
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
            sheet_picture: 'Imagem',
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

            popup_delete_title: 'Deseha excluir esta estante?',
            popup_delete_msg: 'Os livros não serão excĺuídos!',
            popup_delete_cancel: 'Cancelar',
            popup_delete_ok: 'Excluir',
            toast_delete: 'Estante excluída!'

        },
        book_form: {

            isbn_searching: 'Pesquisando...',
            isbn_duplicate: "O livro <strong>{0}</strong> já está cadastrado!",
            isbn_duplicate_notice: "Já existe um livro cadastro com o ISBN informado",

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
