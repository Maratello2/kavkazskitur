import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CreditCard, 
  HeartHandshake, 
  PhoneCall, 
  Plane,
  Scale
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Публичная оферта и правила безопасности экспедиций | KavKazSkiTur',
  description: 'Официальные условия договора оказания услуг по организации горных восхождений и ски-туров. Полномочия старшего гида, правила отмены, обязательная альпинистская страховка и регистрация в МЧС РФ.',
};

export default function OfferPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-200 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Кнопка возврата */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6A00] hover:text-orange-300 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться на главную
        </Link>

        <div className="border border-white/[0.08] rounded-2xl bg-[#08101A] p-6 sm:p-10 shadow-2xl space-y-10">
          {/* Заголовок */}
          <div className="border-b border-white/[0.08] pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#FF6A00] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Статья 437 Гражданского кодекса РФ
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Публичная оферта &amp; Регламент экспедиций
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Исполнитель: ООО «КавказСкиТур» &bull; КБР, г. Нальчик &bull; Регламент сезона 2026
            </p>
          </div>

          {/* 1. ПРЕДМЕТ ОФЕРТЫ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#FF6A00]" />
              <span>1. Предмет договора и акцепт оферты</span>
            </h2>
            <p>
              1.1. Настоящий документ является официальным публичным предложением (публичной офертой в соответствии со статьей 437 Гражданского кодекса РФ) <strong>ООО «КавказСкиТур»</strong> (далее — «Исполнитель») заключить договор на оказание услуг по организации высокогорных программ, альпинистских восхождений, ски-тура и треккинга на Кавказе (Эльбрус 5642 м, Казбек 5033 м, Чегет, Безенги).
            </p>
            <p>
              1.2. Акцептом (безусловным принятием условий настоящей оферты) считается совершение Клиентом любого из следующих действий: внесение предоплаты за выбранную программу, подтверждение бронирования через официальный диалог в WhatsApp / Telegram, заполнение и отправка формы бронирования на Сайте. С момента акцепта договор считается заключенным.
            </p>
          </section>

          {/* 2. ПОЛНОМОЧИЯ ГИДА И БЕЗОПАСНОСТЬ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-amber-500/5 border border-amber-500/20 p-5 sm:p-6 rounded-2xl">
            <h2 className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <span>2. Безусловные полномочия старшего гида и безопасность в горах</span>
            </h2>
            <p>
              Высокогорный альпинизм сопряжен с объективными рисками природной среды: резкие штормовые изменения погоды, шквалистый ветер, лавинная опасность, камнепады, ледовые трещины, низкие температуры и острая горная болезнь (гипоксия).
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 pl-1">
              <li>
                <strong>Безусловный авторитет гида:</strong> Старший сертифицированный инструктор-проводник Исполнителя обладает исключительным правом принимать оперативные решения в целях сохранения жизни и здоровья участников: изменять нитку маршрута, переносить штурм вершины на резервный день или объявлять о полном прекращении восхождения.
              </li>
              <li>
                <strong>Обязательный разворот (Turnback Protocol):</strong> Гид обязан развернуть всю группу или обязать конкретного участника спуститься вниз в сопровождении второго гида в случаях: штормового прогноза, сильного обледенения, нарушения контрольного времени штурма, либо при проявлении у участника симптомов горной болезни (отек легких, отек мозга, потеря координации).
              </li>
              <li>
                <strong>Дисциплинарные требования:</strong> Употребление алкогольных напитков или психоактивных веществ на активной части маршрута, а также самовольный выход на ледник без страховки и каски влекут немедленное отстранение от программы без компенсации стоимости.
              </li>
            </ul>
          </section>

          {/* 3. БРОНИРОВАНИЕ И ВОЗВРАТ (ЗоЗПП ст. 32) */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#FF6A00]" />
              <span>3. Порядок бронирования, оплаты и отказа от услуг</span>
            </h2>
            <p>
              3.1. Для фиксации места в экспедиционной группе Клиент вносит задаток/предоплату в размере 20% от базовой стоимости программы. Оставшаяся часть стоимости вносится до выхода на маршрут на организационном брифинге в Терсколе / Нальчике.
            </p>
            <p>
              3.2. В соответствии со <strong>статьей 32 Закона РФ «О защите прав потребителей»</strong> Клиент вправе отказаться от исполнения договора в любое время при условии оплаты Исполнителю фактически понесенных им расходов (ФПР):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li><strong>Отказ более чем за 30 календарных дней до старта:</strong> Предоплата возвращается в полном объеме за вычетом комиссии банка, либо переносится на любые даты сезона 2026/2027 без штрафов.</li>
              <li><strong>Отказ от 14 до 29 календарных дней:</strong> Из суммы предоплаты удерживаются фактические расходы на невозвратную бронь приюта («Бочки» / «Гарабаши») и закупку группового питания, остаток возвращается клиенту.</li>
              <li><strong>Отказ менее чем за 14 календарных дней или неявка:</strong> Сумма предоплаты удерживается в счет фактически понесенных расходов (забронированные койко-места в высокогорном приюте, оплата работы закрепленных гидов, трансфер).</li>
            </ul>
          </section>

          {/* 4. СТРАХОВАНИЕ И МЧС */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A1424] border border-white/10 p-5 sm:p-6 rounded-2xl">
            <h2 className="text-base sm:text-lg font-bold text-cyan-300 flex items-center gap-2.5">
              <Plane className="w-5 h-5 text-cyan-400" />
              <span>4. Обязательная альпинистская страховка и регистрация в МЧС РФ</span>
            </h2>
            <p>
              4.1. Каждый участник программ с подъемом на высоты свыше 3 500 м <strong>обязан оформить специализированный полис спортивного/альпинистского страхования</strong>, включающий: поисково-спасательные работы (ПСР), медико-транспортную и вертолетную эвакуацию с высоты до 5 642 м с покрытием не менее 30 000 евро/долларов США (или рублевый эквивалент от 2 500 000 руб.).
            </p>
            <p>
              4.2. Исполнитель обеспечивает <strong>официальную регистрацию каждой группы в ГУ МЧС России по КБР</strong> за 10 рабочих дней до начала маршрута. Группы оснащаются средствами радиосвязи, спутниковыми трекерами и групповой аптечкой первой помощи.
            </p>
          </section>

          {/* 5. МЕДИЦИНСКАЯ ДЕКЛАРАЦИЯ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-[#FF6A00]" />
              <span>5. Состояние здоровья и личное снаряжение</span>
            </h2>
            <p>
              Клиент гарантирует, что не имеет медицинских противопоказаний к интенсивным физическим нагрузкам в условиях кислородного голодания (ишемическая болезнь сердца, тяжелая гипертония, тромбозы, тяжелая бронхиальная астма, эпилепсия). Клиент обязуется пройти осмотр личного снаряжения со старшим гидом и взять в прокат сертифицированное снаряжение (кошки, ледоруб, высотные ботинки, страховочную систему) при его отсутствии.
            </p>
          </section>

          {/* 6. РЕКВИЗИТЫ ИСПОЛНИТЕЛЯ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 text-[#FF6A00]" />
              <span>6. Реквизиты Исполнителя и контактные данные</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white/[0.02] p-4 rounded-xl border border-white/[0.08]">
              <div>
                <span className="text-slate-400 block mb-0.5">Организатор экспедиций:</span>
                <strong className="text-white">ООО «КавказСкиТур»</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Адрес местонахождения:</span>
                <strong className="text-white">360000, КБР, г. Нальчик, ул. Горького, д. 74</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Дежурный гид / WhatsApp:</span>
                <a href="https://wa.me/79280828413" className="text-[#FF6A00] font-bold hover:underline">
                  +7 (928) 082-84-13
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Официальная почта:</span>
                <span className="text-white font-mono">info@kavkazskitur.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
