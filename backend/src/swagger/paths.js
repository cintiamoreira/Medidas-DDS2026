/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */

/**
 * @openapi
 * /usuarios/criar-conta:
 *   post:
 *     summary: Criar conta (Firebase Auth)
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conta criada
 *       400:
 *         description: Dados faltando
 *       500:
 *         description: Erro no servidor
 */

/**
 * @openapi
 * /usuarios/login:
 *   post:
 *     summary: Login (Firebase Identity Toolkit)
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens e dados do usuário
 *       400:
 *         description: Dados faltando
 *       500:
 *         description: Erro no login
 */

/**
 * @openapi
 * /medidas/ler:
 *   get:
 *     summary: Ler uma medida por ID
 *     tags: [Medidas]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documento encontrado
 *       400:
 *         description: id obrigatório
 *       404:
 *         description: Medida não encontrada
 *       503:
 *         description: Firestore indisponível
 */

/**
 * @openapi
 * /medidas/ler-todas:
 *   get:
 *     summary: Listar todas as medidas (resumo)
 *     tags: [Medidas]
 *     responses:
 *       200:
 *         description: Lista de medidas
 *       503:
 *         description: Firestore indisponível
 */

/**
 * @openapi
 * /medidas/criar:
 *   post:
 *     summary: Criar medida
 *     tags: [Medidas]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos da medida (idade, peso, altura, etc.)
 *     responses:
 *       201:
 *         description: Medida criada
 *       503:
 *         description: Firestore indisponível
 */

/**
 * @openapi
 * /medidas/atualizar:
 *   put:
 *     summary: Atualizar medida
 *     tags: [Medidas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *               idade:
 *                 type: number
 *               peso:
 *                 type: number
 *     responses:
 *       200:
 *         description: Medida atualizada
 *       400:
 *         description: id inválido
 *       404:
 *         description: Medida não encontrada
 *       503:
 *         description: Firestore indisponível
 */

/**
 * @openapi
 * /medidas/remover:
 *   delete:
 *     summary: Remover medida
 *     tags: [Medidas]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medida removida
 *       400:
 *         description: id obrigatório
 *       404:
 *         description: Medida não encontrada
 *       503:
 *         description: Firestore indisponível
 */
