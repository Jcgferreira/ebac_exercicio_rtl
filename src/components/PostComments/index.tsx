import { FormEvent, useState } from "react";
import styles from "./PostComments.module.css";

import Comment from "../../models/Comment";

const Post = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [tempComment, setTempComment] = useState("");

  function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Adicionei um .trim() para evitar que comentários vazios (apenas espaços) sejam adicionados
    if (tempComment.trim()) {
      const newComment = new Comment(comments.length, tempComment);
      setTempComment("");
      setComments([...comments, newComment]);
    }
  }

  return (
    <div>
      {/* Adicionado data-testid à lista de comentários */}
      <ul className={styles["post-comments"]} data-testid="comment-list">
        {/* Adicionado data-testid a cada item da lista de comentários para identificação individual */}
        {comments.map(({ comment, id }) => (
          <li
            className={styles["post-comment"]}
            key={id}
            data-testid={`comment-item-${id}`}
          >
            <p className={styles["post-comment-content"]}>{comment}</p>
          </li>
        ))}
      </ul>
      <form
        onSubmit={handleAddComment}
        className={styles["post-comments-form"]}
      >
        {/* Adicionado data-testid à textarea do comentário */}
        <textarea
          value={tempComment}
          onChange={(e) => setTempComment(e.target.value)}
          required
          className={styles["post-comments-form-textarea"]}
          data-testid="comment-textarea" // <--- ADICIONE ESTA LINHA
        />
        {/* Adicionado data-testid ao botão de submissão */}
        <button
          type="submit"
          className={styles["post-comments-form-button"]}
          data-testid="submit-comment-button" // <--- ADICIONE ESTA LINHA
        >
          Comentar
        </button>
      </form>
    </div>
  );
};

export default Post;
