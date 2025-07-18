// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fireEvent, render, screen } from "@testing-library/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Post from ".";
import PostComment from ".";

describe("Teste para o componente PostComment", () => {
  it("Deve renderizar o componente corretamente", () => {
    render(<PostComment />);
    expect(screen.getByText("Comentar")).toBeInTheDocument();
  });
});
