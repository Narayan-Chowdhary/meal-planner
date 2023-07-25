class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }





  suggestMeal = () => {
    const message = this.createChatBotMessage(
      "Sure! I can help you suggest a meal. What type of cuisine are you in the mood for?"
    );
    this.addMessageToState(message);

  };

  contactTeam = () => {
    const message = this.createChatBotMessage(
      "If you would like our team to contact you, please provide your email address and phone number."
    );
    this.addMessageToState(message);
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      "I'm sorry, I didn't understand. Can you please rephrase your message?"
    );
    this.addMessageToState(message);
  };

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;
