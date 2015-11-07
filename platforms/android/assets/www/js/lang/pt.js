angular.module("starter.config")
.config(function($translateProvider) {


    $translateProvider.translations('pt', {
        app_name: 'Livrio',
        required_field: 'é obrigatório',
        refresh: 'Atualizar',
        loading: 'Carregando',
        welcome: 'Olá <strong>{0}</strong>, seja bem vindo ao <strong>Livrio.</strong> Por aqui, a gente compartilha livros com quem também ama livros. Eu vou te ajudar a cadastrar os seus e libertá-los para o mundo.',
        offline: 'Você precisa estar conectado a internet. Por favor verifique sua conexão',
        backbutton: 'Pressione o botão voltar para sair',

        app: {
            loading: 'Carregando'
        },


        login: {
            loading_login: 'Entrando',
            loading_create: 'Cadastrando',
            loading_facebook: 'Conectando ao Facebook',
            email_duplicate: '<strong>Email</strong> já cadastrado!',
            login_invalid: 'Ops! E-mail ou senha incorretos. Que tal tentar de novo?',
            login_facebook: 'Ops! Ocorreu algum erro ao tentar acessar o Facebook! Por favor, tente mais tarde.',

            tab_login: 'Entrar',
            tab_create: 'Criar conta',
            field_email: 'E-mail',
            field_password: 'Senha',
            btn_login: 'Entrar',
            btn_facebook: 'Entrar com o Facebook',
            terms: 'Ao entrar no Livrio, você concorda com nossos Termos de Serviços e Política de Privacidade.',

            btn_create: 'Cadastrar',
            field_name: 'Nome completo'

        },

        menu: {
            my_books: 'Meus livros',
            my_friends: 'Amigos',
            my_loans: 'Empréstimos',
            notifications: 'Notificações',
            search: 'Procurar livro',
            shelfs: 'Estantes',
            empty_shelfs: 'Você ainda não tem estantes. Organize seus livros por temas.',
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
            version: 'Versão Android: '
        },
        profile: {
            title: 'Meu perfil',
            btn_save: 'Salvar',
            field_name: 'Nome',
            field_birthday: 'Data de Nascimento',
            field_gender: 'Sexo',
            field_email:'E-mail',
            field_phone:'Celular',
            gender_male: 'Masculino',
            gender_female: 'Feminino',
            info: 'Fique tranquilo. Suas informações só serão utilizadas para sugerir livros que tenham mais a ver com você!',

            sheet_title: 'Foto de perfil',
            sheet_cancel: 'Cancelar',
            sheet_photo: 'Tirar foto',
            sheet_picture: 'Galeria',
            sheet_remove: 'Remover foto',

            toast_save: 'Salvo!',
            toast_photo_error: 'Não foi possível alterar a foto!'


        },
        config: {
            title: 'Configurações',
            allow_search_by_email: 'Permitir que me encontrem pelo email.',
            allow_notification_push: 'Permitir notificações push',
            allow_notification_email: 'Permitir notificações por email',
            allow_accept_friend_facebook: 'Vincular amizades do Facebook',
            allow_connect_facebook: 'Conectado ao Facebook',
            enable_isbn_default: 'Habilitar leitor de ISBN como padrão'
        },
        library: {
            title: 'Meus livros',
            page: 'Páginas',
            empty_list: 'Nenhum livro cadastrado. <p>Clique no <i class="ion ion-plus"></i> para começar.</p><img src="img/bored.svg" />'
        },
        friends: {
            title: 'Meus amigos',
            empty_list: 'Você não tem amigos cadastrados<p>Clique no <i class="ion ion-android-share"></i> para convidar seus amigos.</p><img src="img/bored.svg" />',
            info_facebook: 'Para ter acesso aos livros incríveis que estão parados nas estantes deles, encontre-os por aqui.',
            btn_facebook: 'Conectar ao Facebook',
            book: 'Livros',

            //listagem de livros de amigos
            empty_list_book: 'Nenhum livro encontrado<p>Seu amigo ainda não cadastrou nenhum livro.</p><img src="img/bored.svg" />',
            page: 'Páginas',

            toast_request_friend: 'Solicitação enviada!',
            toast_friend: 'Vocês são amigos agora!',

            invite_msg: 'Oi, agora todos os meus livros estão disponíveis no Livrio e você pode pedir emprestado a hora que quiser.',
            invite_subject: 'Vem ver',
            invite_link: 'http://livr.io/get'

        },
        add_friend: {
            title: 'Encontrar amigos',
            empty_list: '<p>Utilize o campo acima para encontrar seu amigo</p><img src="img/official.svg" />',
            empty_list_search: 'Nenhum amigo encontrado<p>Ops! Não encontramos ninguém com este nome. Que tal tentar de novo?</p><img src="img/bored.svg" />',
            placeholder: 'Procurar pelo nome ou por e-mail'
        },
        loan: {
            title: 'Empréstimos',
            my_books: 'Meus livros',
            friend_books: 'Livros de amigos',
            page: 'Página',
            empty_list: 'Nenhum empréstimo<p>Nenhum livro seu está emprestado. Que tal indicar um livro incrível para um amigo?</p><img src="img/official.svg" />',

            toast_request_cancel: 'Solicitação cancelada!',
            toast_request: 'Solicitação enviada!',
            toast_loan_cancel: 'Empréstimo cancelado!',
            toast_request_loan: 'Solicitação enviada!',
            title_loan: 'Empréstimo',

            msg_loan_info: 'Empréstimo realizado!<br />Entre em contato com seu amigo para combinar a entrega do livro.',



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

        loaned: {
            title: 'Emprestar livro',
            empty_search: 'Não encontrou seu amigo? <p>Talvez ele ainda não conheça o <strong>Livrio</strong>! Utilize a botão <i class="ion ion-android-share-alt"></i> acima para enviar um convite.</p><img src="img/bored.svg" />',


            loading: 'Pesquisando',
            placeholder: 'Procurar amigo...',
            empty_list: '<p>Utilize o campo acima para encontrar seu amigo.</p><img src="img/official.svg" />',

            invite_msg: 'Seu amigo {0} quer te emprestar o livro {1} para você ler. Peça emprestado através do Livrio!',
            invite_subject: '{0} quer te emprestar um livro',
            invite_link: 'http://livr.io/get'
        },
        recommend: {
            title: 'Recomendar livro',
            empty_search: 'Não encontrou seu amigo? <p>Talvez ele ainda não conheça o <strong>Livrio</strong>! Utilize a botão <i class="ion ion-android-share-alt"></i> acima para enviar a recomendação através de outras redes.</p><img src="img/bored.svg" />',


            toast_request: 'Recomendação enviada!',

            loading: 'Pesquisando',
            placeholder: 'Procurar amigo...',
            empty_list: '<p>Utilize o campo acima para encontrar seu amigo.</p><img src="img/official.svg" />',

            invite_msg: 'Seu amigo {0} recomendou o livro {1} para você ler. Peça emprestado através do Livrio!',
            invite_subject: '{0} te recomendou um livro',
            invite_link: 'http://livr.io/get'

        },
        comment: {
            title: 'Comentários',
            placeholder: 'Escreva aqui',
            empty_list: 'Nenhum comentário? <p>Seja o primeiro a comentar este livro.</p><img src="img/official.svg" />'


        },
        notification: {
            title: 'Notificações',
            empty_list: 'Você não tem nenhuma notificação',

            msg_loan_request: '<span>{0}</span> pediu emprestado <span>{1}</span>',
            msg_loan_confirm_yes: '<span>{0}</span> já entregou o livro? <span>{1}</span>',
            msg_loan_confirm_no: '<span>{0}</span> cancelou o empréstimo do livro <span>{1}</span>',
            msg_loan_request_return: '<span>{0}</span> quer seu livro de volta. Entre em contato para combinar a devolução. <span>{1}</span>',
            msg_loan_return_confirm: '<span>{0}</span> devolveu o livro <span>{1}</span>',
            msg_loan_confirm: '<span>{0}</span> deseja te emprestar o livro <span>{1}</span>',
            msg_request_friend: '<span>{0}</span> quer ser seu amigo no Livrio.',
            msg_friend: '<span>{0}</span> é seu amigo agora.',
            msg_friend_like_book: '<span>{0}</span> curtiu seu livro <span>{1}</span>',
            msg_friend_recommend_book: '<span>{0}</span> te recomendou o livro <span>{1}</span>',

            msg_loan_sent_canceled: '<span>{0}</span> cancelou o empréstimo do livro <span>{1}</span>',
            msg_loan_sent_refused: '<span>{0}</span> recusou o empréstimo do livro <span>{1}</span>',

            msg_system_library_empty: '<span>{0}</span> você ainda não cadastrou nenhum livro. Cadastre e compartilhe com seus amigos!',

            msg_system_first_book: 'Parabéns <span>{0}</span>! Você cadastrou seu primeiro livro. Que tal agora convidar seus amigos?',

            msg_system_welcome: 'Olá <span>{0}</span>, seja bem vindo ao <strong>Livrio.</strong> Por aqui, a gente compartilha livros com quem também ama livros. Eu vou te ajudar a cadastrar os seus e libertá-los para o mundo.',

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
            question_friend_msg: 'Você deseja se conectar com <strong>{0}</strong>'

        },
        search: {
            loading: 'Pesquisando',
            title: 'Procurar livros',
            placeholder: 'Título, Autor, Editora, ISBN...',
            empty_list: '<p>Utilize o campo acima para encontrar seu livro</p><img src="img/official.svg" />',
            empty_search: 'Nenhum livro encontrado<p>Ops! Parece que ninguém tem o livro que você está procurando. Faça uma nova busca, conferindo os dados do livro.</p><img src="img/bored.svg" />',
            page: 'Páginas',
            book_friend: 'Livros de amigos'
        },
        book: {
            isbn: 'ISBN',
            author: 'Autor(a)',
            page: 'Páginas',
            publisher: 'Editora',
            synopsis: 'Sinopse',
            late:'Devolução atrasada',
            btn_start_loan: 'Emprestar este livro',
            btn_request_book: 'pedir emprestado',
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

            popup_isbn_title: 'Instrução',
            popup_isbn_btn: 'Ok, entendi!',
            popup_isbn_info: 'Olá {0}, você pode usar o cadastro simplicado de livros, usado o código ISBN.<br /><br /> O <strong>ISBN</strong> é um código de identificação internacional do livro.',

            //tela de emprestimo
            title_loan:'Emprestar livro',

            //popup delete
            question_delete: 'Deseja excluir este livro?',
            question_delete_yes: 'Excluir',
            question_delete_no: 'Cancelar',
            wait_delete: 'Excluindo...',
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
            empty_list: 'Estante vazia. <p>Clique no <i class="ion ion-plus"></i> para começar ou organize os já cadastrados.</p><img src="img/official.svg" />',
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
