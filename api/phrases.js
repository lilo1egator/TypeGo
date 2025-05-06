module.exports = (req, res) => {
  const en = [
    "Keep your chance of and count type make consistency worth big mind.",
    "Into time eyes at shortcuts requires focus.",
    "Your push lazy never type foundation eyes quick make fast,.",
    "Excellence into never your your things keyboard brown eyes requires.",
    "Big screen chance typing take productivity challenge precision.",
    "Every type fast, big every count turns.",
    "Progress keep through patience type mistake.",
    "Make the boost mastering improving calm keep count the of on the.",
    "Fingers and calm eyes of mind the the.",
    "Quick lazy your keyboard skill over foundation patience precision your."
  ];
  const ua = [
    "Тримай темп і уважність під час друкування.",
    "Практика робить майстра, точність важливіша за швидкість.",
    "Вчися друкувати без помилок, тренуйся щодня.",
    "Друкуй впевнено і ритмічно, кожен символ важливий.",
    "Прагни до безпомилкового набору, тренуй швидкість.",
    "Кожен день — новий прогрес, не зупиняйся.",
    "Друкуй із задоволенням, твоя мета — впевненість.",
    "Кожна дія на клавіатурі наближає до майстерності.",
    "Не бійся помилок, вони допомагають стати кращим.",
    "Терпіння у тренуваннях принесе плоди — друкуй швидко."
  ];
  const { lang } = req.query;
  let phrases = en;
  if (lang === 'ua') phrases = ua;
  res.status(200).json({ phrases });
}; 