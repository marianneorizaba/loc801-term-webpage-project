function submitAnswers() {
  const questions = {
      q1: {
          correct: "False",
          correctFeedback: "¡Correcto! Es importante recordar que el hecho de que las comunidades de hablantes utilicen una lengua común no significa que compartan exactamente la misma conceptualización de cada objeto denominado. Si se les pidiera dibujar su conceptualización de una mesa, no habría dos hablantes que dibujaran la misma a partir del inventario mental de las mesas que han conocido o imaginado a lo largo de su vida. Esto es importante porque las personas ajenas a los servicios lingüísticos y a la localización suelen suponer que el significado está contenido en la denominación; sin embargo, las palabras son arbitrarias y están vacías por sí mismas. En realidad, el significado está en los ojos o en la mente de quien lo interpreta. (Alaina Brandt, Introducción a la gestión terminológica, The ATA Chronicle)",
          incorrectFeedback: {
              "True": "Incorrecto. Es importante recordar que el hecho de que las comunidades de hablantes utilicen una lengua común no significa que compartan exactamente la misma conceptualización de cada objeto denominado. Si se les pidiera dibujar su conceptualización de una mesa, no habría dos hablantes que dibujaran la misma a partir del inventario mental de las mesas que han conocido o imaginado a lo largo de su vida. Esto es importante porque las personas ajenas a los servicios lingüísticos y a la localización suelen suponer que el significado está contenido en la denominación; sin embargo, las palabras son arbitrarias y están vacías por sí mismas. En realidad, el significado está en los ojos o en la mente de quien lo interpreta. (Alaina Brandt, Introducción a la gestión terminológica, The ATA Chronicle)",
          }
      },
      q2: {
          correct: "use in a specific subject field",
          correctFeedback: "¡Correcto! El lenguaje de especialidad es una lengua natural utilizada en un campo temático y caracterizada por el uso de medios de expresión específicos (ISO 1087).",
          incorrectFeedback: {
              "independent of any specific subject field": "Incorrecto. El lenguaje de especialidad es una lengua natural utilizada en un campo temático y caracterizada por el uso de medios de expresión específicos (ISO 1087).",
          }
      },
      q3: {
          correct: "rendering of ideas",
          correctFeedback: "¡Correcto!",
          incorrectFeedback: {
              "written content": "Incorrecto. Una característica que comparten la traducción y la interpretación es que ambas reformulan en otra lengua las ideas expresadas en una lengua.",
              "verbal content": "Incorrecto. Una característica que comparten la traducción y la interpretación es que ambas reformulan en otra lengua las ideas expresadas en una lengua."
          }
      }
  };

  try {
    const form = document.forms["quizForm"];
    if (!form) {
        throw new Error("Quiz form not found");
    }

    let unansweredQuestions = [];
    let totalCorrect = 0;

    // Loop through each question
    for (const question in questions) {
        const radioButtons = form[question];
        const feedbackElement = document.getElementById("feedback_" + question);
        
        if (!feedbackElement) {
            throw new Error(`Feedback element for question ${question} not found`);
        }

        if (!radioButtons) {
            throw new Error(`Radio buttons for question ${question} not found`);
        }

        // Check if question is answered
        const selectedValue = radioButtons.value;
        if (selectedValue === "") {
            unansweredQuestions.push(question.replace('q', ''));
            continue;
        }

        // Process answer
        const isCorrect = selectedValue === questions[question].correct;
        if (isCorrect) {
            totalCorrect++;
            feedbackElement.innerHTML = questions[question].correctFeedback;
            feedbackElement.style.color = "green";
        } else {
            feedbackElement.innerHTML = questions[question].incorrectFeedback[selectedValue] || "Incorrecto. Inténtalo de nuevo.";
            feedbackElement.style.color = "red";
        }

        // Make feedback accessible to screen readers
        feedbackElement.setAttribute('role', 'alert');
    }

    // Handle unanswered questions
    if (unansweredQuestions.length > 0) {
        const errorMsg = `Responde ${unansweredQuestions.length === 1 ? 'la pregunta' : 'las preguntas'} ${unansweredQuestions.join(', ')}.`;
        const errorElement = document.getElementById('quiz-error') || createErrorElement();
        errorElement.textContent = errorMsg;
        errorElement.style.display = 'block';
        return false;
    }

    // Announce final score to screen readers
    const scoreAnnouncement = document.createElement('div');
    scoreAnnouncement.setAttribute('role', 'status');
    scoreAnnouncement.setAttribute('aria-live', 'polite');
    scoreAnnouncement.className = 'sr-only';
    scoreAnnouncement.textContent = `Obtuviste ${totalCorrect} de ${Object.keys(questions).length} respuestas correctas`;
    document.querySelector('.quiz-container').appendChild(scoreAnnouncement);

} catch (error) {
    console.error('Quiz error:', error);
    const errorElement = document.getElementById('quiz-error') || createErrorElement();
    errorElement.textContent = 'Ocurrió un error al procesar tus respuestas. Actualiza la página e inténtalo de nuevo.';
    errorElement.style.display = 'block';
}

return false;
}

function createErrorElement() {
const errorElement = document.createElement('div');
errorElement.id = 'quiz-error';
errorElement.className = 'error-message';
errorElement.setAttribute('role', 'alert');
errorElement.style.color = 'red';
document.querySelector('.quiz-container').insertBefore(errorElement, document.querySelector('#quizForm'));
return errorElement;
}