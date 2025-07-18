import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // Para simular interações do usuário
import App from "./App"; // Importe o seu componente principal

// Limpa o DOM após cada teste. Com CRA/Jest, isso já costuma ser automático.
afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("should allow users to add two comments and display them", async () => {
    // 1. Renderizar o componente App
    render(<App />);

    // 2. Encontrar os elementos do formulário
    // Baseado no seu CommentForm, o label é "Adicione seu comentário:"
    // E o input tem role="textbox" por padrão (e é type="text").
    const commentInput = screen.getByRole("textbox", {
      name: /adicione seu comentário:/i, // Ajustado para o label do seu input
    });

    // Baseado no seu CommentForm, o botão tem o texto "Adicionar Comentário"
    const submitButton = screen.getByRole("button", {
      name: /adicionar comentário/i, // Ajustado para o texto do seu botão
    });

    // 3. Simular a inserção do primeiro comentário
    const firstCommentText = "Este é o meu primeiro comentário.";
    await userEvent.type(commentInput, firstCommentText); // Digita no input
    await userEvent.click(submitButton); // Clica no botão de enviar

    // 4. Verificar se o primeiro comentário aparece na tela
    // findByText é assíncrono e espera o elemento aparecer.
    expect(await screen.findByText(firstCommentText)).toBeInTheDocument();
    // Verifica se o campo de input foi limpo após o envio
    expect(commentInput).toHaveValue("");

    // 5. Simular a inserção do segundo comentário
    const secondCommentText = "Um segundo comentário para testar!";
    await userEvent.type(commentInput, secondCommentText); // Digita o segundo comentário
    await userEvent.click(submitButton); // Clica para enviar

    // 6. Verificar se o segundo comentário também aparece na tela
    expect(await screen.findByText(secondCommentText)).toBeInTheDocument();
    // Verifica se agora existem dois itens de comentário na lista
    const commentsListItems = screen.getAllByRole("listitem"); // Pega todos os elementos com role="listitem"
    expect(commentsListItems).toHaveLength(2);

    // Opcional: Verificar se a ordem e o conteúdo estão corretos
    expect(commentsListItems[0]).toHaveTextContent(firstCommentText);
    expect(commentsListItems[1]).toHaveTextContent(secondCommentText);
  });

  it('should display "Nenhum comentário ainda." initially', () => {
    render(<App />);
    // Verifica se o texto "Nenhum comentário ainda." está presente na renderização inicial
    expect(screen.getByText("Nenhum comentário ainda.")).toBeInTheDocument();
  });
});
describe("App (usando data-testid)", () => {
  it("permite inserir dois comentários e exibi-los corretamente", async () => {
    render(<App />);

    // Encontra o input e o botão usando data-testid
    const commentInput = screen.getByTestId("comment-input");
    const submitButton = screen.getByTestId("comment-submit");

    // Primeiro comentário
    const firstComment = "Primeiro comentário de teste.";
    await userEvent.type(commentInput, firstComment);
    await userEvent.click(submitButton);

    // Verifica se o primeiro comentário aparece
    const commentItems = screen.getAllByTestId("comment-item");
    expect(commentItems).toHaveLength(1);
    expect(commentItems[0]).toHaveTextContent(firstComment);
    expect(commentInput).toHaveValue("");

    // Segundo comentário
    const secondComment = "Segundo comentário de teste.";
    await userEvent.type(commentInput, secondComment);
    await userEvent.click(submitButton);

    // Verifica se ambos os comentários aparecem
    const updatedCommentItems = screen.getAllByTestId("comment-item");
    expect(updatedCommentItems).toHaveLength(2);
    expect(updatedCommentItems[0]).toHaveTextContent(firstComment);
    expect(updatedCommentItems[1]).toHaveTextContent(secondComment);
  });
});
