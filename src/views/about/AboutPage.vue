<template>
  <div class="about">
    <section class="about-header">
      <h1>Смартфоны, которые подходят именно вам</h1>
      <p>
        Мы создали этот магазин, чтобы выбор нового телефона был простым, прозрачным и приятным.
        Никаких сложных технических терминов — только реальные факты и удобные инструменты для сравнения.
      </p>
    </section>

    <section class="about-grid">
      <div v-for="item in values" :key="item.title" class="about-card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const values = [
  { title: 'Только оригинал', text: 'Работаем напрямую с проверенными поставщиками. Никаких подделок — только официальная и сертифицированная техника.' },
  { title: 'Честные цены', text: 'Держим доступную стоимость за счет оптимизации логистики и отсутствия лишних наценок.' },
  { title: 'Умный подбор', text: 'Используйте нашу систему детального сравнения характеристик, чтобы выбрать смартфон под свои задачи и бюджет.' }
]
</script>

<style lang="scss" scoped>
.about {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
  color: rgb(31, 41, 55);

  &-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 50px;

    h1 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    p {
      font-size: 1.1rem;
      color: rgb(75, 85, 99);
      line-height: 1.6;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  &-card {
    background: rgb(249, 250, 251);
    border: 1px solid rgb(229, 231, 235);
    padding: 32px 24px;
    border-radius: 12px;

    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: rgb(17, 24, 39);
    }

    p {
      font-size: 0.95rem;
      color: rgb(75, 85, 99);
      line-height: 1.5;
    }
  }
}
</style>