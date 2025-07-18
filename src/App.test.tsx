import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App"; // Importa o componente principal App

// Garante que o DOM seja limpo após a execução de cada teste,
// para que um teste não interfira no próximo.
afterEach(() => {
  cleanup();
});

describe("Componente App - Teste de Inserção de Comentários (via Post e PostComments)", () => {
  it("deve permitir que o usuário adicione dois comentários e os exiba corretamente na aplicação", async () => {
    // 1. Renderiza o componente 'App'. Isso renderizará toda a árvore de componentes, incluindo Post e PostComments.
    render(<App />);

    // 2. Encontra a textarea e o botão de submissão do formulário de comentários usando seus data-testids.
    // Esses data-testids estão no componente PostComments, mas são acessíveis via o DOM renderizado pelo App.
    const commentTextarea = screen.getByTestId("comment-textarea");
    const submitButton = screen.getByTestId("submit-comment-button");

    // 3. Simula a digitação e submissão do primeiro comentário.
    const firstCommentText = "Primeiro comentário na aplicação!";
    await userEvent.type(commentTextarea, firstCommentText);
    await userEvent.click(submitButton);

    // 4. Verifica se o primeiro comentário foi adicionado e está visível na tela.
    // 'findByText' é assíncrono e espera o elemento aparecer.
    expect(await screen.findByText(firstCommentText)).toBeInTheDocument();
    // Verifica se a textarea foi limpa após o envio.
    expect(commentTextarea).toHaveValue("");

    // 5. Simula a digitação e submissão do segundo comentário.
    const secondCommentText =
      "Segundo comentário, a aplicação está funcionando!";
    await userEvent.type(commentTextarea, secondCommentText);
    await userEvent.click(submitButton);

    // 6. Verifica se o segundo comentário também foi adicionado e está visível na tela.
    expect(await screen.findByText(secondCommentText)).toBeInTheDocument();

    // 7. Verifica se a lista de comentários agora contém exatamente dois itens.
    // 'getAllByTestId' é usado para encontrar múltiplos elementos que correspondem a um padrão de 'data-testid'.
    const commentsListItems = screen.getAllByTestId(/comment-item-/);
    expect(commentsListItems).toHaveLength(2); // Espera que haja dois comentários na lista.

    // Opcional: Verifica o conteúdo de texto de cada item para confirmar a ordem e o valor.
    expect(commentsListItems[0]).toHaveTextContent(firstCommentText);
    expect(commentsListItems[1]).toHaveTextContent(secondCommentText);
  });

  it("deve exibir uma lista de comentários vazia inicialmente na aplicação", () => {
    // Renderiza o componente 'App'.
    render(<App />);

    // Verifica se a lista de comentários está vazia na renderização inicial.
    // 'getByTestId('comment-list')' encontra o elemento 'ul' da lista.
    const commentList = screen.getByTestId("comment-list");
    expect(commentList).toBeEmptyDOMElement(); // Verifica se o elemento não possui filhos.

    // Alternativamente, podemos verificar que nenhum item de comentário foi renderizado.
    expect(screen.queryAllByTestId(/comment-item-/)).toHaveLength(0);
  });

  it("não deve adicionar um comentário vazio ou apenas com espaços na aplicação", async () => {
    // Renderiza o componente 'App'.
    render(<App />);

    const commentTextarea = screen.getByTestId("comment-textarea");
    const submitButton = screen.getByTestId("submit-comment-button");

    // Tenta submeter um comentário contendo apenas espaços.
    await userEvent.type(commentTextarea, "   ");
    await userEvent.click(submitButton);

    // Verifica que a textarea não foi limpa (pois o `required` e o `trim()` agiram)
    expect(commentTextarea).toHaveValue("   ");

    // Verifica que nenhum item de comentário foi adicionado à lista.
    expect(screen.queryAllByTestId(/comment-item-/)).toHaveLength(0);

    // Verifica se a lista de comentários permanece vazia.
    const commentList = screen.getByTestId("comment-list");
    expect(commentList).toBeEmptyDOMElement();
  });
});
