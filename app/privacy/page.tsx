import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2, Cookie, UserCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных (152-ФЗ) | KavKazSkiTur',
  description: 'Официальная политика обработки и защиты персональных данных в соответствии с Федеральным законом № 152-ФЗ «О персональных данных». Экспедиционный центр KavKazSkiTur, Нальчик, КБР.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-200 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6A00] hover:text-orange-300 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться на главную
        </Link>

        <div className="border border-white/[0.08] rounded-2xl bg-[#08101A] p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Заголовок документа */}
          <div className="border-b border-white/[0.08] pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#FF6A00] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" />
              152-ФЗ «О персональных данных»
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Политика обработки персональных данных &amp; Уведомление о Cookie
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Оператор: ООО «КавказСкиТур» &bull; КБР, г. Нальчик &bull; Редакция действует с 2026 года
            </p>
          </div>

          {/* 1. ОБЩИЕ ПОЛОЖЕНИЯ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF6A00]" />
              1. Общие положения и правовые основания
            </h2>
            <p>
              1.1. Настоящая Политика обработки персональных данных (далее — «Политика») определяет порядок сбора, хранения, передачи и защиты персональных данных пользователей сайта <strong>kavkazskitur.com</strong> (далее — «Сайт») в соответствии с <strong>Федеральным законом РФ от 27.07.2006 № 152-ФЗ «О персональных данных»</strong>, а также законодательством РФ в области защиты прав потребителей.
            </p>
            <p>
              1.2. Оператором персональных данных является <strong>ООО «КавказСкиТур»</strong> (ОГРН: в стадии регистрации/обновления, ИНН: 0725000000, адрес: 360000, Кабардино-Балкарская Республика, г. Нальчик, ул. Горького, д. 74).
            </p>
            <p>
              1.3. Использование сервисов Сайта, заполнение форм обратной связи, бронирование экспедиций или направление сообщений в мессенджеры означает безоговорочное согласие пользователя с настоящей Политикой. В случае несогласия с условиями Политики пользователь обязан прекратить использование Сайта.
            </p>
          </section>

          {/* 2. СОСТАВ СОБИРАЕМЫХ ДАННЫХ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF6A00]" />
              2. Категории обрабатываемых персональных данных
            </h2>
            <p>
              Оператор обрабатывает только те персональные данные, которые необходимы для безопасной организации горных восхождений, спасательного обеспечения и связи с клиентом:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li><strong>Контактные данные:</strong> фамилия, имя, отчество, контактный номер телефона, идентификатор в WhatsApp / Telegram, адрес электронной почты;</li>
              <li><strong>Параметры бронирования:</strong> выбранная программа тура (Эльбрус, Казбек, ски-тур), даты заезда, предпочтения по прокату высотного снаряжения;</li>
              <li><strong>Данные для официальных пропусков и регистрации:</strong> паспортные данные (серия, номер, кем и когда выдан, дата рождения) — <em>запрашиваются исключительно при необходимости оформления официального пропуска в пограничную зону ФСБ РФ и для обязательной регистрации группы в ГУ МЧС России по КБР</em>;</li>
              <li><strong>Данные экстренной связи:</strong> контактное лицо для экстренной связи (ФИО и телефон), подтверждение отсутствия медицинских противопоказаний для подъема на высоты свыше 3 500 м.</li>
            </ul>
          </section>

          {/* 3. ЦЕЛИ ОБРАБОТКИ ДАННЫХ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" />
              3. Цели обработки персональных данных
            </h2>
            <p>Персональные данные обрабатываются Оператором в следующих целях:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li>Обработка входящих заявок, бронирование слотов в группах, выставление счетов и оперативная коммуникация в WhatsApp;</li>
              <li><strong>Обязательная регистрация туристских групп в МЧС России</strong> (не позднее чем за 10 рабочих дней до начала маршрута в соответствии со ст. 14 Федерального закона № 132-ФЗ и Приказом МЧС России № 42);</li>
              <li>Подача списков на оформление коллективных или индивидуальных пропусков в пограничную зону Пограничного управления ФСБ России по КБР;</li>
              <li>Бронирование высотного размещения в высокогорных приютах (приют «Гарабаши» / «Бочки», «Сердце Эльбруса») и организация трансфера Минеральные Воды — Приэльбрусье.</li>
            </ul>
          </section>

          {/* 4. ЛОКАЛИЗАЦИЯ И ХРАНЕНИЕ В РФ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A1424] p-5 rounded-2xl border border-white/10">
            <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              4. Локализация баз данных на территории РФ (ч. 5 ст. 18 152-ФЗ)
            </h2>
            <p>
              Оператор подтверждает, что при сборе персональных данных граждан Российской Федерации запись, систематизация, накопление, хранение, уточнение (обновление, изменение) и извлечение персональных данных осуществляются с использованием баз данных, находящихся исключительно на территории Российской Федерации.
            </p>
            <p className="text-slate-400 text-xs">
              Трансграничная передача персональных данных не осуществляется без предварительного письменного согласия субъекта персональных данных.
            </p>
          </section>

          {/* 5. ИСПОЛЬЗОВАНИЕ COOKIE */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[#FF6A00]" />
              5. Использование файлов Cookie и веб-аналитики
            </h2>
            <p>
              Сайт использует файлы cookie (куки) и аналитические инструменты (Яндекс.Метрика) для анализа посещаемости, улучшения работы интерфейса и сохранения пользовательских настроек (выбор фильтров, статус согласия на куки).
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li><strong>Технические cookie:</strong> необходимы для корректной работы интерактивных карт, 3D-модулей WebGL и сессий авторизации;</li>
              <li><strong>Аналитические cookie:</strong> собираются в обезличенном виде для оценки конверсии страниц и устранения технических ошибок;</li>
              <li><strong>Управление cookie:</strong> пользователь может в любой момент отключить или удалить файлы cookie в настройках своего интернет-браузера.</li>
            </ul>
          </section>

          {/* 6. ПРАВА ПОЛЬЗОВАТЕЛЯ И ОТЗЫВ СОГЛАСИЯ */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.08] pt-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FF6A00]" />
              6. Права субъекта персональных данных и порядок отзыва
            </h2>
            <p>
              Пользователь имеет право на получение информации, касающейся обработки его персональных данных, требовать их уточнения, блокирования или уничтожения в случае, если данные являются неполными, устаревшими или незаконно полученными.
            </p>
            <p>
              Согласие на обработку персональных данных может быть отозвано субъектом персональных данных в любой момент путем направления письменного заявления в свободной форме на адрес электронной почты: <strong>info@kavkazskitur.com</strong> с темой «Отзыв согласия на обработку ПДн». Оператор прекращает обработку данных в срок, не превышающий 10 рабочих дней с момента получения заявления.
            </p>

            {/* Реквизиты оператора */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs space-y-2 mt-4">
              <div className="font-bold text-white text-sm mb-1">Реквизиты ответственного за организацию обработки ПДн:</div>
              <div><strong>Оператор:</strong> ООО «КавказСкиТур» (Expedition Center KavKazSkiTur)</div>
              <div><strong>Юридический адрес:</strong> 360000, Кабардино-Балкарская Республика, г. Нальчик, ул. Горького, д. 74</div>
              <div><strong>Телефон дежурной службы:</strong> +7 (928) 082-84-13 / +7 (928) 691-44-05</div>
              <div><strong>Официальный e-mail для обращений:</strong> info@kavkazskitur.com</div>
              <div><strong>Прямая диспетчерская служба в WhatsApp:</strong> <a href="https://wa.me/79280828413" className="text-[#FF6A00] underline font-bold">+7 (928) 082-84-13</a></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
