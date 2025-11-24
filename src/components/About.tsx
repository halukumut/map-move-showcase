const About = () => {
  return <section id="about" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl shadow-strong p-6 md:p-12 lg:p-16 border border-border/50">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-5xl font-bold mb-4 text-foreground">Biz Kimiz</h2>
            </div>
            
            <div className="space-y-4 md:space-y-6 text-muted-foreground px-2 md:px-8">
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                Taşımacılık sektöründe 30 yılı aşan bir deneyime sahibiz. Demir profil taşımacılığı ve ev/eşya taşıma alanlarında uzun yıllardır edindiğimiz bilgi birikimini, güvenlik ve planlama odaklı bir hizmet anlayışıyla birleştiriyoruz. Her taşıma sürecinde yükün niteliğine uygun bir çalışma düzeni kurar, süreci sorunsuz ve güvenilir şekilde tamamlamaya özen gösteririz.
              </p>
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                Tecrübemiz, disiplinimiz ve güvenilirliğimizle her işte istikrarlı bir hizmet sunmayı hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default About;